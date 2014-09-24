package main

import (
	"flag"
	"log"
	"net/rpc"
	"net/rpc/jsonrpc"

	"github.com/cgrates/cgradmin/admin"
)

var (
	version     = flag.Bool("version", false, "Prints the application version.")
	verbose     = flag.Bool("verbose", false, "Show extra info about command execution.")
	server      = flag.String("server", "127.0.0.1:2012", "server address host:port")
	rpcEncoding = flag.String("rpc_encoding", "json", "RPC encoding used <gob|json>")
)

func main() {
	flag.Parse()
	var err error
	var client *rpc.Client
	if *rpcEncoding == "json" {
		log.Print("Using JSON encoding...")
		client, err = jsonrpc.Dial("tcp", *server)
	} else {
		log.Print("Using GOB encoding...")
		client, err = rpc.Dial("tcp", *server)
	}
	if err != nil {
		log.Panic(err)
	}

	router := admin.Start(client)

	router.Run(":8080")
}
