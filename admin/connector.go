package admin

import (
	"net/rpc"
	"net/rpc/jsonrpc"
	"strings"
)

type CGRConnector struct {
	encoding string
	server   string
	client   *rpc.Client
}

func NewCGRConnector(encoding, server string) *CGRConnector {
	c := &CGRConnector{encoding: encoding, server: server}
	c.connect()
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
