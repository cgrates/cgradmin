package admin

import (
	"log"
	"net/rpc"
	"net/rpc/jsonrpc"
	"strings"

	"github.com/hoisie/redis"
)

type CGRConnector struct {
	encoding string
	server   string
	client   *rpc.Client
	redis    *redis.Client
}

type Args struct {
	ServiceMethod string
	Params        interface{}
}

func NewCGRConnector(encoding, server, redisAdr string) *CGRConnector {
	c := &CGRConnector{encoding: encoding, server: server}
	// connect to redis
	c.redis = &redis.Client{Addr: redisAdr, Db: 7}
	return c
}

func (c *CGRConnector) connect() (err error) {
	if c.encoding == "json" {
		c.client, err = jsonrpc.Dial("tcp", c.server)
	} else {
		c.client, err = rpc.Dial("tcp", c.server)
	}
	return
}

func (c *CGRConnector) call(serviceMethod string, args interface{}, reply interface{}) (err error) {
	if c.client == nil {
		if err = c.connect(); err != nil {
			return err
		}
	}
	if err = c.client.Call(serviceMethod, args, reply); err != nil {
		if strings.Contains(err.Error(), "connection is shut down") {
			if err = c.connect(); err != nil {
				return err
			}
			return c.client.Call(serviceMethod, args, reply)
		}
	}
	return
}

func (c *CGRConnector) Call(args Args, reply *interface{}) error {
	log.Printf("Call: %+v", args)
	return c.call(args.ServiceMethod, args.Params, reply)
}
