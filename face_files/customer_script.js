(function() {
    window.CS = (function() {
        function CS() {}

        CS.api_url = document.currentScript.src.split('js/')[0];

        // CS.default_timeout = 12000;

        // CS.poll_time = 2000;

        CS.getLineItem = function() {
            if (CS.$('body').find('.wk_lineitem').length) {
                var dl_flag = 1;
                var _lineitems = CS.$('.wk_lineitem');
                CS.$.each(_lineitems, function(i, val) {
                    var _this = CS.$(this);
                    var line_item_id = CS.$(this).data('wk_lineitemid');
                    CS.$.ajax({
                        url: "" + CS.api_url + "index.php?p=check_digital",
                        type: "GET",
                        // async: false,
                        // jsonpCallback: 'getLineItem',
                        dataType: "jsonp",
                        data: {
                            shop: Shopify.shop,
                            line_item_id: line_item_id
                        },
                        success: function(data, status, jxhr) {
                            // console.log(data);
                            if (data.available == 0) {
                                return false;
                            } else {
                                if (dl_flag == 1) {
                                    CS.$(_this).parent().parent().find('thead tr').append("<th>Download link</th>");
                                    dl_flag = 0;
                                }
                                var vid = 0;
                                if (typeof(data.vid) != "undefined")
                                    vid = data.vid;
                                CS.$.ajax({
                                    url: "" + CS.api_url + "index.php?p=get_dl_link",
                                    type: "GET",
                                    // async: false,
                                    dataType: "jsonp",
                                    data: {
                                        shop: Shopify.shop,
                                        pid: data.pid,
                                        vid: vid,
                                        order_id: data.order_id
                                    },
                                    success: function(result) {
                                        if (result.link)
                                            CS.$(_this).append('<td><a href="' + result.link + '" target="_blank">Download</a></td>');
                                        else
                                            return false;
                                    }
                                });
                            }
                        },
                        error: function(xhr) {
                            console.log(xhr);
                        }
                    });
                });
            }
        };

        return CS;
    })();

    CS.loadjQuery = function(afterLoad) {

        return CS.loadScript("//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js", function() {
            CS.$ = jQuery.noConflict(true);
            return afterLoad();
        });
    };

    CS.loadScript = function(url, callback) {
        var script;
        script = document.createElement("script");
        script.type = "text/javascript";

        if (script.readyState) {
            script.onreadystatechange = function() {
                if (script.readyState === "loaded" || script.readyState === "complete") {
                    script.onreadystatechange = null;
                    return callback();
                }
            };
        } else {
            script.onload = function() {
                return callback();
            };
        }

        script.src = url;
        return document.getElementsByTagName("head")[0].appendChild(script);
    };

    CS.path = window.location.pathname.split('/');

    CS.account_path = CS.path[1] === 'account';
    CS.orders_path = CS.path[2] === 'orders';
    CS.order_token = CS.path[3];

    if (CS.account_path && CS.orders_path) {
        CS.loadjQuery(function() {
            CS.$.ajaxSetup({
                cache: false
            });

            CS.getLineItem();

        });
    }

}).call(this);