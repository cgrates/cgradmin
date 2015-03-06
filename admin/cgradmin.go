package admin

import (
	"net/http"
	"net/rpc"
	"net/rpc/jsonrpc"
	"text/template"

	"github.com/zenazn/goji"
	"github.com/zenazn/goji/web"
	"golang.org/x/net/websocket"
)

var (
	connector          *CGRConnector
	username, password string
	templates          *template.Template
)

func Start(conn *CGRConnector, user, pass string) {
	connector = conn
	username = user
	password = pass
	templates = template.Must(template.ParseGlob("templates/*.tmpl"))

	rpc.Register(conn)

	goji.Get(LOGIN_PATH, loginGet)
	goji.Post(LOGIN_PATH, loginPost)

	goji.Get("/app/*", http.FileServer(http.Dir("./static")))

	auth := web.New()
	goji.Handle("/*", auth)
	auth.Use(SessionAuth)
	auth.Handle("/ws", websocket.Handler(func(ws *websocket.Conn) {
		jsonrpc.ServeConn(ws)
	}))
	auth.Post("/import/", importPost)
	auth.Post("/exportcdrs/", exportCdrsPost)
	auth.Post("/exporttpcsv/", exportTpToCsvPost)
	auth.Get("/accounts/logout", logoutGet)
	auth.Get("/", http.RedirectHandler("/app/", 301))
}
