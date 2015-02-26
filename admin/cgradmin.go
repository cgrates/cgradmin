package admin

import (
	"net/http"
	"text/template"

	"github.com/zenazn/goji"
	"github.com/zenazn/goji/web"
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

	goji.Get(LOGIN_PATH, loginGet)
	goji.Post(LOGIN_PATH, loginPost)

	goji.Post("/call/:method", callPost)
	goji.Get("/app/*", http.FileServer(http.Dir("./static")))

	auth := web.New()
	goji.Handle("/*", auth)
	auth.Use(SessionAuth)
	auth.Post("/import/", importPost)
	auth.Post("/exportcdrs/", exportCdrsPost)
	auth.Post("/exporttpcsv/", exportTpToCsvPost)
	auth.Get("/accounts/logout", logoutGet)
	auth.Get("/", http.RedirectHandler("/app/", 301))
}
