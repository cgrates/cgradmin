package admin

import (
	"crypto/rand"
	"encoding/hex"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
)

const (
	LOGIN_COOKIE = "sessionid"
	LOGIN_PATH   = "/accounts/login/"
)

func SessionAuth() gin.HandlerFunc {
	return func(c *gin.Context) {
		if !IsAuthenticated(c.Request) {
			c.Redirect(301, "LOGIN_PATH")
			c.Abort(-1)
			return
		}
		c.Next()
	}
}

func IsAuthenticated(r *http.Request) bool {
	cookie, err := r.Cookie(LOGIN_COOKIE)
	if err != nil || cookie == nil {
		return false
	}
	if _, ok := sessionsMap[cookie.Value]; !ok {
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
