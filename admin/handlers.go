package admin

import (
	"encoding/base64"
	"encoding/json"
	"io/ioutil"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
)

func callPost(c *gin.Context) {
	if !IsAuthenticated(c.Request) {
		c.JSON(401, map[string]string{"error": "not_autenticated"})
		return
	}
	method := c.Params.ByName("method")
	var param gin.H
	c.Bind(&param)
	var response interface{}
	if err := connector.call(method, param, &response); err != nil {
		c.JSON(200, map[string]string{"ERROR": err.Error()})
		return
	}
	c.JSON(200, response)
}

func loginGet(c *gin.Context) {
	if IsAuthenticated(c.Request) {
		next := c.Request.FormValue("next")
		if next != "" {
			c.Redirect(301, next)
			return
		} else {
			c.Redirect(301, "/a/")
			return
		}
	}
	c.HTML(200, "login.tmpl", nil)
}

type LoginForm struct {
	User     string `form:"user" binding:"required"`
	Password string `form:"password" binding:"required"`
	Remember string `form:"remember" binding:"required"`
}

func loginPost(c *gin.Context) {
	var form LoginForm

	c.BindWith(&form, binding.Form)
	if form.User == username && form.Password == password {
		uuid := GenUUID()
		sessionsMap[uuid] = true
		cookie := &http.Cookie{
			Name:   LOGIN_COOKIE,
			Value:  uuid,
			Domain: c.Request.URL.Host,
			Path:   "/",
		}
		if form.Remember == "on" {
			oneMonth, _ := time.ParseDuration("720h")
			cookie.Expires = time.Now().Add(oneMonth)
		}
		http.SetCookie(c.Writer, cookie)
		next := c.Request.FormValue("next")
		if next != "" {
			c.Redirect(301, next)
			return
		} else {
			c.Redirect(301, "/a/")
			return
		}
	} else {
		c.JSON(401, gin.H{"status": "unauthorized"})
	}
}

func importPost(c *gin.Context) {
	param := make(map[string]string)
	if param["TPid"] == "" {
		msg, _ := json.Marshal("ERROR: Please enter a tpid")
		c.Redirect(301, "/a/#/import/"+base64.StdEncoding.EncodeToString(msg))
		return
	}
	file, _, err := c.Request.FormFile("file")
	if err != nil {
		msg, _ := json.Marshal("ERROR: Please select a file")
		c.Redirect(301, "/a/#/import/"+base64.StdEncoding.EncodeToString(msg))
		return
	}
	if file != nil {
		defer file.Close()
	}
	param["TPid"] = c.Request.FormValue("tpid")
	content, err := ioutil.ReadAll(file)
	param["File"] = base64.StdEncoding.EncodeToString(content)
	var response interface{}
	if err = connector.call("ApierV2.ImportTPZipFile", param, &response); err != nil {
		msg, _ := json.Marshal("ERROR: " + err.Error())
		c.Redirect(301, "/a/#/import/"+base64.StdEncoding.EncodeToString(msg))
	}
	msg, _ := json.Marshal(response)
	c.Redirect(301, "/a/#/import/"+base64.StdEncoding.EncodeToString(msg))
}

func exportCdrsPost(c *gin.Context) {
	param := make(map[string]interface{})
	if tmp := c.Request.FormValue("CdrFormat"); len(tmp) > 0 {
		param["CdrFormat"] = tmp
	}
	if tmp := c.Request.FormValue("FieldSeparator"); len(tmp) > 0 {
		param["FieldSeparator"] = tmp
	}
	if tmp := c.Request.FormValue("CgrIds"); len(tmp) > 0 {
		param["CgrIds"] = strings.Split(tmp, ",")
	}
	if tmp := c.Request.FormValue("MediationRunIds"); len(tmp) > 0 {
		param["MediationRunIds"] = strings.Split(tmp, ",")
	}
	if tmp := c.Request.FormValue("TORs"); len(tmp) > 0 {
		param["TORs"] = strings.Split(tmp, ",")
	}
	if tmp := c.Request.FormValue("CdrHosts"); len(tmp) > 0 {
		param["CdrHosts"] = strings.Split(tmp, ",")
	}
	if tmp := c.Request.FormValue("CdrSources"); len(tmp) > 0 {
		param["CdrSources"] = strings.Split(tmp, ",")
	}
	if tmp := c.Request.FormValue("ReqTypes"); len(tmp) > 0 {
		param["ReqTypes"] = strings.Split(tmp, ",")
	}
	if tmp := c.Request.FormValue("Directions"); len(tmp) > 0 {
		param["Directions"] = strings.Split(tmp, ",")
	}
	if tmp := c.Request.FormValue("Tenants"); len(tmp) > 0 {
		param["Tenants"] = strings.Split(tmp, ",")
	}
	if tmp := c.Request.FormValue("Categories"); len(tmp) > 0 {
		param["Categories"] = strings.Split(tmp, ",")
	}
	if tmp := c.Request.FormValue("Accounts"); len(tmp) > 0 {
		param["Accounts"] = strings.Split(tmp, ",")
	}
	if tmp := c.Request.FormValue("Subjects"); len(tmp) > 0 {
		param["Subjects"] = strings.Split(tmp, ",")
	}
	if tmp := c.Request.FormValue("DestinationPrefixes"); len(tmp) > 0 {
		param["DestinationPrefixes"] = strings.Split(tmp, ",")
	}
	if tmp := c.Request.FormValue("RatedAccounts"); len(tmp) > 0 {
		param["RatedAccounts"] = strings.Split(tmp, ",")
	}
	if tmp := c.Request.FormValue("RatedSubjects"); len(tmp) > 0 {
		param["RatedSubjects"] = strings.Split(tmp, ",")
	}
	var err error
	if tmp := c.Request.FormValue("RatedSubjects"); len(tmp) > 0 {
		if param["RatedSubjects"], err = strconv.ParseFloat(tmp, 64); err != nil {
			msg, _ := json.Marshal("Error: " + err.Error())
			c.Redirect(301, "/a/#/exportcdrs/"+base64.StdEncoding.EncodeToString(msg))

		}
	}
	if tmp := c.Request.FormValue("CostMultiplyFactor"); len(tmp) > 0 {
		if param["CostMultiplyFactor"], err = strconv.ParseFloat(tmp, 64); err != nil {
			msg, _ := json.Marshal("Error: " + err.Error())
			c.Redirect(301, "/a/#/exportcdrs/"+base64.StdEncoding.EncodeToString(msg))
		}
	}
	if tmp := c.Request.FormValue("CostShiftDigits"); len(tmp) > 0 {
		if param["CostShiftDigits"], err = strconv.ParseInt(tmp, 10, 64); err != nil {
			msg, _ := json.Marshal("Error: " + err.Error())
			c.Redirect(301, "/a/#/exportcdrs/"+base64.StdEncoding.EncodeToString(msg))
		}
	}
	if tmp := c.Request.FormValue("RoundDecimals"); len(tmp) > 0 {
		if param["RoundDecimals"], err = strconv.ParseInt(tmp, 10, 64); err != nil {
			msg, _ := json.Marshal("Error: " + err.Error())
			c.Redirect(301, "/a/#/exportcdrs/"+base64.StdEncoding.EncodeToString(msg))
		}
	}
	if tmp := c.Request.FormValue("MaskLength"); len(tmp) > 0 {
		if param["MaskLength"], err = strconv.ParseInt(tmp, 10, 64); err != nil {
			msg, _ := json.Marshal("Error: " + err.Error())
			c.Redirect(301, "/a/#/exportcdrs/"+base64.StdEncoding.EncodeToString(msg))
		}
	}
	if tmp := c.Request.FormValue("OrderIdStart"); len(tmp) > 0 {
		if param["OrderIdStart"], err = strconv.ParseInt(tmp, 10, 64); err != nil {
			msg, _ := json.Marshal("Error: " + err.Error())
			c.Redirect(301, "/a/#/exportcdrs/"+base64.StdEncoding.EncodeToString(msg))
		}
	}
	if tmp := c.Request.FormValue("OrderIdEnd"); len(tmp) > 0 {
		if param["OrderIdEnd"], err = strconv.ParseInt(tmp, 10, 64); err != nil {
			msg, _ := json.Marshal("Error: " + err.Error())
			c.Redirect(301, "/a/#/exportcdrs/"+base64.StdEncoding.EncodeToString(msg))
		}
	}
	if tmp := c.Request.FormValue("SkipErrors"); len(tmp) > 0 {
		if param["SkipErrors"], err = strconv.ParseBool(tmp); err != nil {
			msg, _ := json.Marshal("Error: " + err.Error())
			c.Redirect(301, "/a/#/exportcdrs/"+base64.StdEncoding.EncodeToString(msg))
		}
	}
	if tmp := c.Request.FormValue("SkipRated"); len(tmp) > 0 {
		if param["SkipRated"], err = strconv.ParseBool(tmp); err != nil {
			msg, _ := json.Marshal("Error: " + err.Error())
			c.Redirect(301, "/a/#/exportcdrs/"+base64.StdEncoding.EncodeToString(msg))
		}
	}
	if tmp := c.Request.FormValue("SuppressCgrIds"); len(tmp) > 0 {
		if param["SuppressCgrIds"], err = strconv.ParseBool(tmp); err != nil {
			msg, _ := json.Marshal("Error: " + err.Error())
			c.Redirect(301, "/a/#/exportcdrs/"+base64.StdEncoding.EncodeToString(msg))
		}
	}
	var response interface{}
	if err = connector.call("ApierV2.ExportCdrsToZipString", param, &response); err != nil {
		msg, _ := json.Marshal("ERROR: " + err.Error())
		c.Redirect(301, "/a/#/exportcdrs/"+base64.StdEncoding.EncodeToString(msg))
	}
	if response != nil {
		buf, err := base64.StdEncoding.DecodeString(response.(string))
		if err != nil {
			msg, _ := json.Marshal("ERROR: " + err.Error())
			c.Redirect(301, "/a/#/exportcdrs/"+base64.StdEncoding.EncodeToString(msg))
		}
		c.Writer.Header().Set("Content-Type", "application/x-zip-compressed")
		c.Writer.Header().Set("Content-Disposition", "attachment; filename=cgr_cdrs_export.zip")
		c.Writer.Write(buf)
		c.Writer.Flush()
	} else {
		msg, _ := json.Marshal("ERROR: no CDRs found!")
		c.Redirect(301, "/a/#/exportcdrs/"+base64.StdEncoding.EncodeToString(msg))
	}
}
