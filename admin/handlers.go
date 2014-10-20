package admin

import (
	"encoding/base64"
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/zenazn/goji/web"
)

func callPost(c web.C, w http.ResponseWriter, r *http.Request) {
	if !IsAuthenticated(r) {
		writeJSON(w, 401, map[string]string{"error": "not_autenticated"})
		return
	}
	method := c.URLParams["method"]
	var param map[string]interface{}
	decoder := json.NewDecoder(r.Body)
	defer r.Body.Close()
	decoder.Decode(&param)
	var response interface{}
	if err := connector.call(method, param, &response); err != nil {
		log.Print("CALL: ", err)
		writeJSON(w, 200, map[string]string{"ERROR": err.Error()})
		return
	}
	writeJSON(w, 200, response)
}

func loginGet(c web.C, w http.ResponseWriter, r *http.Request) {
	if IsAuthenticated(r) {
		next := r.FormValue("next")
		if next != "" {
			http.Redirect(w, r, next, 301)
			return
		} else {
			http.Redirect(w, r, "/app/", 301)
			return
		}
	}
	templates.ExecuteTemplate(w, "login.tmpl", nil)
}

func loginPost(c web.C, w http.ResponseWriter, r *http.Request) {
	user := r.FormValue("user")
	pass := r.FormValue("password")
	remember := r.FormValue("remember")
	if user == username && pass == password {
		uuid := GenUUID()
		sessionsMap[uuid] = true
		cookie := &http.Cookie{
			Name:   LOGIN_COOKIE,
			Value:  uuid,
			Domain: r.URL.Host,
			Path:   "/",
		}
		if remember == "on" {
			oneMonth, _ := time.ParseDuration("720h")
			cookie.Expires = time.Now().Add(oneMonth)
		}
		http.SetCookie(w, cookie)
		next := r.FormValue("next")
		if next != "" {
			http.Redirect(w, r, next, 301)
			return
		} else {
			http.Redirect(w, r, "/app/", 301)
			return
		}
	} else {
		writeJSON(w, 401, map[string]string{"error": "not_autenticated"})
	}
}

func importPost(c web.C, w http.ResponseWriter, r *http.Request) {
	param := make(map[string]string)
	param["TPid"] = r.FormValue("tpid")
	if param["TPid"] == "" {
		msg, _ := json.Marshal("ERROR: Please enter a tpid")
		http.Redirect(w, r, "/app/#/import/"+base64.StdEncoding.EncodeToString(msg), 301)
		return
	}
	file, _, err := r.FormFile("file")
	if err != nil {
		msg, _ := json.Marshal("ERROR: Please select a file")
		http.Redirect(w, r, "/app/#/import/"+base64.StdEncoding.EncodeToString(msg), 301)
		return
	}
	if file != nil {
		defer file.Close()
	}
	content, err := ioutil.ReadAll(file)
	param["File"] = base64.StdEncoding.EncodeToString(content)
	var response interface{}
	if err = connector.call("ApierV2.ImportTPZipFile", param, &response); err != nil {
		msg, _ := json.Marshal("ERROR: " + err.Error())
		http.Redirect(w, r, "/app/#/import/"+base64.StdEncoding.EncodeToString(msg), 301)
	}
	msg, _ := json.Marshal(response)
	http.Redirect(w, r, "/app/#/import/"+base64.StdEncoding.EncodeToString(msg), 301)
}

func exportTpToCsvPost(c web.C, w http.ResponseWriter, r *http.Request) {
	param := make(map[string]interface{})
	if tmp := r.FormValue("tpid"); len(tmp) > 0 {
		param["TPid"] = tmp
	}
	if tmp := r.FormValue("fileformat"); len(tmp) > 0 {
		param["FileFormat"] = tmp
	} else {
		param["FileFormat"] = "csv"
	}
	if tmp := r.FormValue("fieldseparator"); len(tmp) > 0 {
		param["FieldSeparator"] = tmp
	} else {
		param["FieldSeparator"] = ","
	}
	param["Compress"] = true

	var response interface{}
	var err error
	if err = connector.call("ApierV2.ExportTPToZipString", param, &response); err != nil {
		msg, _ := json.Marshal("ERROR: " + err.Error())
		http.Redirect(w, r, "/app/#/exporttpcsv/"+base64.StdEncoding.EncodeToString(msg), 301)
	}
	if response != nil {
		buf, err := base64.StdEncoding.DecodeString(response.(string))
		if err != nil {
			msg, _ := json.Marshal("ERROR: " + err.Error())
			http.Redirect(w, r, "/app/#/exporttpcsv/"+base64.StdEncoding.EncodeToString(msg), 301)
		}
		w.Header().Set("Content-Type", "application/x-zip-compressed")
		w.Header().Set("Content-Disposition", "attachment; filename=tp_csv.zip")
		w.Write(buf)
	} else {
		msg, _ := json.Marshal("ERROR: no TP data found!")
		http.Redirect(w, r, "/app/#/exporttpcsv/"+base64.StdEncoding.EncodeToString(msg), 301)
	}
}

func exportCdrsPost(c web.C, w http.ResponseWriter, r *http.Request) {
	param := make(map[string]interface{})
	if tmp := r.FormValue("CdrFormat"); len(tmp) > 0 {
		param["CdrFormat"] = tmp
	}
	if tmp := r.FormValue("FieldSeparator"); len(tmp) > 0 {
		param["FieldSeparator"] = tmp
	}
	if tmp := r.FormValue("CgrIds"); len(tmp) > 0 {
		param["CgrIds"] = strings.Split(tmp, ",")
	}
	if tmp := r.FormValue("MediationRunIds"); len(tmp) > 0 {
		param["MediationRunIds"] = strings.Split(tmp, ",")
	}
	if tmp := r.FormValue("TORs"); len(tmp) > 0 {
		param["TORs"] = strings.Split(tmp, ",")
	}
	if tmp := r.FormValue("CdrHosts"); len(tmp) > 0 {
		param["CdrHosts"] = strings.Split(tmp, ",")
	}
	if tmp := r.FormValue("CdrSources"); len(tmp) > 0 {
		param["CdrSources"] = strings.Split(tmp, ",")
	}
	if tmp := r.FormValue("ReqTypes"); len(tmp) > 0 {
		param["ReqTypes"] = strings.Split(tmp, ",")
	}
	if tmp := r.FormValue("Directions"); len(tmp) > 0 {
		param["Directions"] = strings.Split(tmp, ",")
	}
	if tmp := r.FormValue("Tenants"); len(tmp) > 0 {
		param["Tenants"] = strings.Split(tmp, ",")
	}
	if tmp := r.FormValue("Categories"); len(tmp) > 0 {
		param["Categories"] = strings.Split(tmp, ",")
	}
	if tmp := r.FormValue("Accounts"); len(tmp) > 0 {
		param["Accounts"] = strings.Split(tmp, ",")
	}
	if tmp := r.FormValue("Subjects"); len(tmp) > 0 {
		param["Subjects"] = strings.Split(tmp, ",")
	}
	if tmp := r.FormValue("DestinationPrefixes"); len(tmp) > 0 {
		param["DestinationPrefixes"] = strings.Split(tmp, ",")
	}
	if tmp := r.FormValue("RatedAccounts"); len(tmp) > 0 {
		param["RatedAccounts"] = strings.Split(tmp, ",")
	}
	if tmp := r.FormValue("RatedSubjects"); len(tmp) > 0 {
		param["RatedSubjects"] = strings.Split(tmp, ",")
	}
	var err error
	if tmp := r.FormValue("RatedSubjects"); len(tmp) > 0 {
		if param["RatedSubjects"], err = strconv.ParseFloat(tmp, 64); err != nil {
			msg, _ := json.Marshal("Error: " + err.Error())
			http.Redirect(w, r, "/app/#/exportcdrs/"+base64.StdEncoding.EncodeToString(msg), 301)

		}
	}
	if tmp := r.FormValue("CostMultiplyFactor"); len(tmp) > 0 {
		if param["CostMultiplyFactor"], err = strconv.ParseFloat(tmp, 64); err != nil {
			msg, _ := json.Marshal("Error: " + err.Error())
			http.Redirect(w, r, "/app/#/exportcdrs/"+base64.StdEncoding.EncodeToString(msg), 301)
		}
	}
	if tmp := r.FormValue("CostShiftDigits"); len(tmp) > 0 {
		if param["CostShiftDigits"], err = strconv.ParseInt(tmp, 10, 64); err != nil {
			msg, _ := json.Marshal("Error: " + err.Error())
			http.Redirect(w, r, "/app/#/exportcdrs/"+base64.StdEncoding.EncodeToString(msg), 301)
		}
	}
	if tmp := r.FormValue("RoundDecimals"); len(tmp) > 0 {
		if param["RoundDecimals"], err = strconv.ParseInt(tmp, 10, 64); err != nil {
			msg, _ := json.Marshal("Error: " + err.Error())
			http.Redirect(w, r, "/app/#/exportcdrs/"+base64.StdEncoding.EncodeToString(msg), 301)
		}
	}
	if tmp := r.FormValue("MaskLength"); len(tmp) > 0 {
		if param["MaskLength"], err = strconv.ParseInt(tmp, 10, 64); err != nil {
			msg, _ := json.Marshal("Error: " + err.Error())
			http.Redirect(w, r, "/app/#/exportcdrs/"+base64.StdEncoding.EncodeToString(msg), 301)
		}
	}
	if tmp := r.FormValue("OrderIdStart"); len(tmp) > 0 {
		if param["OrderIdStart"], err = strconv.ParseInt(tmp, 10, 64); err != nil {
			msg, _ := json.Marshal("Error: " + err.Error())
			http.Redirect(w, r, "/app/#/exportcdrs/"+base64.StdEncoding.EncodeToString(msg), 301)
		}
	}
	if tmp := r.FormValue("OrderIdEnd"); len(tmp) > 0 {
		if param["OrderIdEnd"], err = strconv.ParseInt(tmp, 10, 64); err != nil {
			msg, _ := json.Marshal("Error: " + err.Error())
			http.Redirect(w, r, "/app/#/exportcdrs/"+base64.StdEncoding.EncodeToString(msg), 301)
		}
	}
	if tmp := r.FormValue("SkipErrors"); len(tmp) > 0 {
		if param["SkipErrors"], err = strconv.ParseBool(tmp); err != nil {
			msg, _ := json.Marshal("Error: " + err.Error())
			http.Redirect(w, r, "/app/#/exportcdrs/"+base64.StdEncoding.EncodeToString(msg), 301)
		}
	}
	if tmp := r.FormValue("SkipRated"); len(tmp) > 0 {
		if param["SkipRated"], err = strconv.ParseBool(tmp); err != nil {
			msg, _ := json.Marshal("Error: " + err.Error())
			http.Redirect(w, r, "/app/#/exportcdrs/"+base64.StdEncoding.EncodeToString(msg), 301)
		}
	}
	if tmp := r.FormValue("SuppressCgrIds"); len(tmp) > 0 {
		if param["SuppressCgrIds"], err = strconv.ParseBool(tmp); err != nil {
			msg, _ := json.Marshal("Error: " + err.Error())
			http.Redirect(w, r, "/app/#/exportcdrs/"+base64.StdEncoding.EncodeToString(msg), 301)
		}
	}
	var response interface{}
	if err = connector.call("ApierV2.ExportCdrsToZipString", param, &response); err != nil {
		msg, _ := json.Marshal("ERROR: " + err.Error())
		http.Redirect(w, r, "/app/#/exportcdrs/"+base64.StdEncoding.EncodeToString(msg), 301)
	}
	if response != nil {
		buf, err := base64.StdEncoding.DecodeString(response.(string))
		if err != nil {
			msg, _ := json.Marshal("ERROR: " + err.Error())
			http.Redirect(w, r, "/app/#/exportcdrs/"+base64.StdEncoding.EncodeToString(msg), 301)
		}
		w.Header().Set("Content-Type", "application/x-zip-compressed")
		w.Header().Set("Content-Disposition", "attachment; filename=cgr_cdrs_export.zip")
		w.Write(buf)
	} else {
		msg, _ := json.Marshal("ERROR: no CDRs found!")
		http.Redirect(w, r, "/app/#/exportcdrs/"+base64.StdEncoding.EncodeToString(msg), 301)
	}
}
