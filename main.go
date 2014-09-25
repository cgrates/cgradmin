package main

import (
	"flag"

	"github.com/cgrates/cgradmin/admin"
)

var (
	version     = flag.Bool("version", false, "Prints the application version.")
	verbose     = flag.Bool("verbose", false, "Show extra info about command execution.")
	server      = flag.String("server", "127.0.0.1:2012", "server address host:port")
	rpcEncoding = flag.String("rpc_encoding", "json", "RPC encoding used <gob|json>")
	username    = flag.String("user", "root", "Admin username for the webapp")
	password    = flag.String("pass", "testus", "Admin password  for the webapp")
)

func main() {
	flag.Parse()
	router := admin.Start(admin.NewCGRConnector(*rpcEncoding, *server), *username, *password)
	router.Run(":8080")
}
