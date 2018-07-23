const Vue = require("vue");
const config = require("config");

if (!Vue.prototype.$isServer && !window.fbAsyncInit) {
    window.enableComments = function() {
        (function(d, s, id) {
            var js,
                fjs = d.getElementsByTagName(s)[0];
            js = d.createElement(s);
            js.id = id;
            js.src = "https://connect.facebook.net/en_US/all.js";

            if (d.getElementById(id)) {
                //if <script id="facebook-jssdk"> exists
                delete window.FB;
                fjs.parentNode.replaceChild(js, fjs);
            } else {
                fjs.parentNode.insertBefore(js, fjs);
            }
        })(document, "script", "facebook-jssdk");

        window.fbAsyncInit = function() {
            if (typeof FB != "undefined" && FB != null) {
                FB.init({
                    appId: config.facebook_id, //App ID from the app dashboard
                    status: true, //Check Facebook Login status
                    xfbml: true //Look for social plugins on the page
                });

                if(typeof ga !== 'undefined') {
                    // //Logged In Users
                    FB.getLoginStatus(function(response) {
                        if (response.status !== "unknown") {
                            ga("set", "dimension2", "Logged In");
                        }
                    });
                    //Facebook Likes
                    FB.Event.subscribe("edge.create", function(href, widget) {
                        ga("send", {
                            hitType: "social",
                            socialNetwork: "Facebook",
                            socialAction: "Like",
                            socialTarget: href,
                            page: document.title.replace(
                                " | ",
                                config.site_title,
                                ""
                            )
                        });
                    });
                    //Facebook Unlikes
                    FB.Event.subscribe("edge.remove", function(href, widget) {
                        ga("send", {
                            hitType: "social",
                            socialNetwork: "Facebook",
                            socialAction: "Unlike",
                            socialTarget: href,
                            page: document.title.replace(
                                " | ",
                                config.site_title,
                                ""
                            )
                        });
                    });
                    //Facebook Send/Share
                    FB.Event.subscribe("message.send", function(href, widget) {
                        ga("send", {
                            hitType: "social",
                            socialNetwork: "Facebook",
                            socialAction: "Send",
                            socialTarget: href,
                            page: document.title.replace(
                                " | ",
                                config.site_title,
                                ""
                            )
                        });
                    });
                    //Facebook Comments
                    FB.Event.subscribe("comment.create", function(href, widget) {
                        ga("send", {
                            hitType: "social",
                            socialNetwork: "Facebook",
                            socialAction: "Comment",
                            socialTarget: href,
                            page: document.title.replace(
                                " | ",
                                config.site_title,
                                ""
                            )
                        });
                    });
                }
            }
        };
    }
}
