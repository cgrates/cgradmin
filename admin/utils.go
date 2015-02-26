package admin

import (
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"net/http"
	"strconv"
	"time"

	"github.com/zenazn/goji/web"
)

const (
	LOGIN_COOKIE = "sessionid"
	LOGIN_PATH   = "/accounts/login/"
)

func SessionAuth(c *web.C, h http.Handler) http.Handler {
	fn := func(w http.ResponseWriter, r *http.Request) {
		if !IsAuthenticated(r) {
			http.Redirect(w, r, LOGIN_PATH+"?next="+r.URL.Path, 301)
			return
		}
		h.ServeHTTP(w, r)
	}
	return http.HandlerFunc(fn)
}

func IsAuthenticated(r *http.Request) bool {
	cookie, err := r.Cookie(LOGIN_COOKIE)
	if err != nil || cookie == nil {
		return false
	}
	if _, err := connector.redis.Get(cookie.Value); err != nil {
		return false
	}
	return true
}

func GenUUID() string {
	uuid := make([]byte, 16)
	n, err := rand.Read(uuid)
	if n != len(uuid) || err != nil {
		return strconv.FormatInt(time.Now().UnixNano(), 10)
	}
	// TODO: verify the two lines implement RFC 4122 correctly
	uuid[8] = 0x80 // variant bits see page 5
	uuid[4] = 0x40 // version 4 Pseudo Random, see page 7

	return hex.EncodeToString(uuid)
}

func writeJSON(w http.ResponseWriter, code int, data interface{}) error {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	encoder := json.NewEncoder(w)
	return encoder.Encode(data)
}
