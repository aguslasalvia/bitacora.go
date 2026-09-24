package routes

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func SetupRoutes() *gin.Engine {

	gin.SetMode(gin.ReleaseMode)

	r := gin.Default()

	// allow cors && specific methods
	r.Use(cors.New(
		cors.Config{
			AllowOrigins: []string{"*"},
			AllowMethods: []string{"POST", "GET"},
			AllowHeaders: []string{"Content-Type"},
		},
	))

	// inport && init routes
	RecordRouter(r)

	// static frontend (Astro build output, kept alongside the binary at ./web)
	r.Static("/_astro", "./web/_astro")
	r.StaticFile("/favicon.ico", "./web/favicon.ico")
	r.StaticFile("/favicon.svg", "./web/favicon.svg")
	r.StaticFile("/", "./web/index.html")

	return r
}
