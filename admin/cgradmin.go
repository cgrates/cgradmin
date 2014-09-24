package admin

import (
	"net/rpc"

	"github.com/gin-gonic/gin"
)

var (
	client      *rpc.Client
	sessionsMap = make(map[string]bool)
)

func Start(c *rpc.Client) *gin.Engine {
	client = c

	gin.SetMode(gin.ReleaseMode)
	router := gin.Default()
	router.LoadHTMLGlob("./templates/*.tmpl")

	router.POST("/call/:method", callPost)
	router.GET(LOGIN_PATH, loginGet)
	router.POST(LOGIN_PATH, loginPost)
	authorized := router.Group("/")
	authorized.Use(SessionAuth())
	authorized.Static("/a/", "./static/app")
	authorized.GET("/", func(c *gin.Context) {
		c.Redirect(301, "/a/")
	})
	authorized.POST("/import/", importPost)
	authorized.POST("/exportcdrs/", exportCdrsPost)

	return router
}
