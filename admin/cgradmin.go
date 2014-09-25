package admin

import "github.com/gin-gonic/gin"

var (
	connector          *CGRConnector
	sessionsMap        = make(map[string]bool)
	username, password string
)

func Start(conn *CGRConnector, user, pass string) *gin.Engine {
	connector = conn
	username = user
	password = pass

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
