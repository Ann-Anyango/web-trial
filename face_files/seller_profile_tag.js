console.log('1');
(function() {
    window.SPL = (function() {
        function SPL() {}
        SPL.api_url = document.currentScript.src.split('js/')[0];

        console.log(SPL.api_url);
        SPL.notifyDetails = '';
        SPL.handle = 0;
        SPL.var_id = 0;
        SPL.request_arr = Array();
        SPL.minimum_quantity_status = true;
        SPL.pay_what_you_want = false;
        SPL.first_submit = true;
        SPL.wk_routes_insurance_price = 0;
        SPL.wk_insurance_selected = 0;
        SPL.main_checkout_condition = true;
        SPL.postcodewise_and_storepickup_active = 0;
        SPL.showLoader = function () {
            SPL.$('body').find('.mp-loader').show();
        };

        if (typeof wk_label_checkout_btn === "undefined")
            wk_label_checkout_btn = "Checkout";

        SPL.removeLoader = function () {
            SPL.$('body').find('.mp-loader').hide();
        }

        SPL.getAllConfigDetails = function () {
            if (SPL.wk_main_id_product != "" && SPL.wk_main_id_product != undefined)
                return SPL.$.ajax({
                    url: SPL.api_url + 'index.php?p=ajax_seller_profile_tag',
                    type: "GET",
                    async: true,
                    cache: false,
                    jsonpCallback: 'getAllConfigDetails',
                    contentType: "application/json",
                    dataType: "jsonp",
                    data: {
                        shop: SPL.shop_name,
                        main_id_product: SPL.wk_main_id_product,
                        show_seller_info: SPL.show_seller_info,
                        request_arr: SPL.request_arr,
                        storedIds: SPL.storedIds,
                        main_id_variant: SPL.main_id_variant,
                        selected_tag: SPL.wk_selected_tag
                    },
                    success: function (response_data) {
                        if (response_data != "shop_not_found") {
                            if (response_data.sellerProduct != undefined && response_data.sellerProduct == true) {
                                SPL.$('.contact_btn').show();
                            }
                            /* sellProfileCallback callback task start */
                            if (SPL.$.inArray('sellProfileCallback', SPL.request_arr) != -1) {

                                var data = response_data.sellProfileCallback;
                                SPL.active = data.active;
                                SPL.store_name = data.sp_store_name;
                                SPL.store_name_handle = data.store_name_handle;
                                SPL.wk_url_type = data.url_type;
                                if (SPL.active == 1) {
                                    /***** valerie customization start ******/
                                    if (SPL.$(".wk_seller_detail").length) {
                                        SPL.$(".wk_seller_detail").css('display', 'block');
                                        // var html_con = 'Sold BY <a href="/a/seller/'+SPL.store_name+'">'+SPL.store_name+'</a>';
                                        var html_con = wk_seller_rating = '';
                                        var wk_advance_review = [];
                                        
                                        var sold_by = data.labels['Sold By'];
                                        if (data.has_sp_page > 0) {
                                            if (data.seller_profile_type == '1')
                                                html_con = sold_by + ' <a href="/pages/seller-profile' + SPL.wk_url_type + SPL.store_name_handle + '">' + SPL.store_name + '</a>';
                                            else {
                                                if (data.with_collection == '1')
                                                    html_con = sold_by + ' <a href="/collections/' + SPL.store_name_handle + '">' + SPL.store_name + '</a>';
                                                else
                                                    html_con = sold_by + ' <a href="/collections/vendors?q=' + SPL.store_name + '">' + SPL.store_name + '</a>';
                                            }
                                        }
                                        else
                                            html_con = sold_by + ' <a href="/a/seller/' + SPL.store_name_handle + '">' + SPL.store_name + '</a>';

                                        // if (SPL.$(".wk-rateit").length) {
                                        //     var review = (data.review != "" && data.review != null) ? parseInt(data.review) : 0;
                                        //     var total_review = (data.total_review != "" && data.total_review != null) ? parseInt(data.total_review) : 0;
                                        //     wk_seller_rating = " <div id='rate' class='wk-vendor-rateit' style='display:inline-block'></div> <script type='text/javascript'>" +
                                        //         "(function(){ $('#rate').rateYo({starWidth: '15px', rating: " + review + ", spacing   : '5px'," +
                                        //         "multiColor: {'startColor': '#" + data.start_color + "', 'endColor'  : '#" + data.end_color + "'}, readOnly: true, numStars: 5 }); }); </script>";
                                        //     SPL.$(".wk-rateit").html(wk_seller_rating)
                                        // }
                                        // if (data.seller_vacation_message != undefined && data.seller_vacation_message != "") {
                                        //     html_con += "<div id='seller_vacation_div'><p id='seller_vacation_message' style='color:red;'>" + data.seller_vacation_message + "</p></div>";
                                        // }
                                        // SPL.$(".wk_seller_detail").html(html_con)
                                        // SPL.$(".wk-vendor-rateit:eq(0)").after("(" + total_review + ")")
                                        var rev_data = data;
                                        if (SPL.$(".wk-rateit").length) {
                                            setTimeout(function () {
                                                if (typeof $ == "function") {
                                                    var review = (rev_data.review != "" && rev_data.review != null) ? parseFloat(rev_data.review) : 0;
                                                    var total_review = (rev_data.total_review != "" && rev_data.total_review != null) ? parseFloat(rev_data.total_review) : 0;
                                                    
                                                    if(rev_data.advance_feedback_option_status == 1){
                                                        SPL.$.each(rev_data.feedback_options , function(key , value){
                                                         
                                                            wk_advance_review[value.handle] = " <div style='display:flex'>"+value.feedback_option+"<div id='rate_"+value.handle+"' class='wk-vendor-rateit' style='margin-top:4px;'></div><div>";

                                                            SPL.$(".wk-rateit").append(wk_advance_review[value.handle]);
                                                            SPL.$(".wk-vendor-rateit:eq("+key+")").after("(" + rev_data.count_ar[value.handle] + ")");
                                                            $('#rate_'+value.handle).rateYo({
                                                                'starWidth': '15px',
                                                                'rating': rev_data.advance_review[value.handle],
                                                                'spacing': '5px',
                                                                'multiColor': {
                                                                    'startColor': "#" + rev_data.start_color,
                                                                    'endColor': "#" + rev_data.end_color
                                                                },
                                                                'readOnly': true,
                                                                'numStars': 5
                                                            });

                                                        });

                                                      
                                                        wk_advance_review['overall_avg'] = " <div style='display:flex'> Overall Average Rating<div id='rate_overall_avg' class='wk-vendor-rateit' style='padding-left:10px;'></div></div>";

                                                        SPL.$(".wk-rateit").append(wk_advance_review['overall_avg']);
                                                        
                                                        $('#rate_overall_avg').rateYo({
                                                            'starWidth': '15px',
                                                            'rating': rev_data.advance_review_overall_avg,
                                                            'spacing': '5px',
                                                            'multiColor': {
                                                                'startColor': "#" + rev_data.start_color,
                                                                'endColor': "#" + rev_data.end_color
                                                            },
                                                            'readOnly': true,
                                                            'numStars': 5
                                                        });


                                                    }
                                                    else{
                                                        wk_seller_rating = " <div id='rate' class='wk-vendor-rateit' style='display:inline-block'></div>";
                                                        SPL.$(".wk-rateit").html(wk_seller_rating);
                                                        SPL.$(".wk-vendor-rateit:eq(0)").after("(" + total_review + ")");
                                                        $('#rate').rateYo({
                                                            'starWidth': '15px',
                                                            'rating': review,
                                                            'spacing': '5px',
                                                            'multiColor': {
                                                                'startColor': "#" + rev_data.start_color,
                                                                'endColor': "#" + rev_data.end_color
                                                            },
                                                            'readOnly': true,
                                                            'numStars': 5
                                                        });
                                                    }
                                                   
                                                }
                                            }, 500);
                                        }
                                        if (data.seller_vacation_message != undefined && data.seller_vacation_message != "") {
                                            html_con += "<div id='seller_vacation_div'><p id='seller_vacation_message' style='color:red;'>" + data.seller_vacation_message + "</p></div>";
                                        }
                                        SPL.$(".wk_seller_detail").html(html_con);
                                    }

                                    if (SPL.$(".wk_seller_detail_n_logo").length > 0) {
                                        if (data.has_sp_page > 0)
                                            SPL.$(".wk_seller_detail_n_logo").html('<a href="/pages/seller-profile' + SPL.wk_url_type + SPL.store_name_handle + '"><span>' + SPL.store_name + '</span></a>');
                                        else
                                            SPL.$(".wk_seller_detail_n_logo").html('<a href="/a/seller/' + SPL.store_name_handle + '"><span>' + SPL.store_name + '</span></a>');
                                    }

                                    if (SPL.$(".wk_seller_detail_logo").length > 0 && data.logo) {
                                        if (data.has_sp_page > 0)
                                        {
                                            if (data.seller_profile_type == '1')
                                                SPL.$(".wk_seller_detail_logo").html('<a href="/pages/seller-profile' + SPL.wk_url_type + SPL.store_name_handle + '"><img id="wk_seller_detail_logo_img" src="' + data.logo + '" alt="' + SPL.store_name + '" style="max-height:50px;"></a>');
                                            else {
                                                if (data.with_collection == '1')
                                                    SPL.$(".wk_seller_detail_logo").html('<a href="/collections/' + SPL.store_name_handle + '"><img id="wk_seller_detail_logo_img" src="' + data.logo + '" alt="' + SPL.store_name + '" style="max-height:50px;"></a>');
                                                else
                                                    SPL.$(".wk_seller_detail_logo").html('<a href="/collections/vendors?q=' + SPL.store_name + '"><img id="wk_seller_detail_logo_img" src="' + data.logo + '" alt="' + SPL.store_name + '" style="max-height:50px;"></a>');
                                            }
                                        }
                                        else
                                            SPL.$(".wk_seller_detail_logo").html('<a href="/a/seller/' + SPL.store_name_handle + '"><img id="wk_seller_detail_logo_img" src="' + data.logo + '" alt="' + SPL.store_name + '" style="max-height:50px;"></a>');
                                    }
                                    /** seller store logo block */
                                    if (SPL.$(".wk_seller_store_logo").length > 0 && data.shop_logo) {
                                        if (data.has_sp_page > 0)
                                        {
                                            if (data.seller_profile_type == '1')
                                                SPL.$(".wk_seller_store_logo").html('<a href="/pages/seller-profile' + SPL.wk_url_type + SPL.store_name_handle + '"><img id="wk_seller_store_logo_img" src="' + data.shop_logo + '" alt="' + SPL.store_name + '" style="max-height:50px;"></a>');
                                            else {
                                                if (data.with_collection == '1')
                                                    SPL.$(".wk_seller_store_logo").html('<a href="/collections/' + SPL.store_name_handle + '"><img id="wk_seller_store_logo_img" src="' + data.shop_logo + '" alt="' + SPL.store_name + '" style="max-height:50px;"></a>');
                                                else
                                                    SPL.$(".wk_seller_store_logo").html('<a href="/collections/vendors?q=' + SPL.store_name + '"><img id="wk_seller_store_logo_img" src="' + data.shop_logo + '" alt="' + SPL.store_name + '" style="max-height:50px;"></a>');
                                            }
                                        }   
                                        else
                                            SPL.$(".wk_seller_store_logo").html('<a href="/a/seller/' + SPL.store_name_handle + '"><img id="wk_seller_store_logo_img" src="' + data.shop_logo + '" alt="' + SPL.store_name + '" style="max-height:50px;"></a>');
                                        
                                    }
                                }
                                /***** valerie customization end *******/

                                // Show Seller address and contact info on product view page
                                if (SPL.$(".wk_seller_info").length && SPL.show_seller_info == 1) {
                                    if ((typeof data != "undefined" && data != "")) {
                                        var seller_info_html = '' +
                                            '<div class="wk_seller_info_div" style="border:1px solid #ccc; padding:10px 5px;">' +
                                            '<address>';
                                        if (data.store_address != '' && data.store_address != null)
                                            seller_info_html += '<store>' + data.store_address + '</store><br>';
                                        if (data.city != '' && data.city != null)
                                            seller_info_html += '<city>' + data.city + '</city><br>';
                                        if (data.state != '' && data.state != null)
                                            seller_info_html += '<state>' + data.state + '</state>, ';
                                        if (data.country != '' && data.country != null)
                                            seller_info_html += '<country>' + data.country + '</country><br>';
                                        if (data.contact != '' && data.contact != null)
                                            seller_info_html += '<abbr id="wk_seller_phone" title="Phone">Phone : ' + data.contact + '</abbr>';
                                        if (data.email != '' && data.email != null)
                                            seller_info_html += '<p id="wk_seller_email"><a href="mailto:' + data.email + '" target="_top">' + data.email + '</a></p>';

                                        seller_info_html += '</address>';
                                        seller_info_html += '</div>';
                                        SPL.$(".wk_seller_info").html(seller_info_html);
                                    }
                                }
                            }

                            /* sellProfileCallback callback task ends */
                            if (SPL.$.inArray('hasSellerVacationDiv', SPL.request_arr) != -1) {
                                if (response_data.hasSellerVacationDiv) {
                                    data = response_data.hasSellerVacationDiv;
                                    if (data.seller_vacation_message != undefined && data.seller_vacation_message != "")
                                        SPL.$("#wk_seller_vacation_div").html("<p id='seller_vacation_message' style='color:red;'>" + data.seller_vacation_message + "</p>");
                                }
                            }

                            /* CutomeFieldDetailCallback callback task starts */
                            if (SPL.$.inArray('CutomeFieldDetailCallback', SPL.request_arr) != -1 && response_data.CutomeFieldDetailCallback != false) {
                                data = response_data.CutomeFieldDetailCallback
                                if (typeof (data) === 'undefined' || data == '') {

                                } else {
                                    if (data.prod_field_value) {
                                        SPL.$(".wk_product_custom_detail").css('display', 'block');
                                        SPL.$(".wk_product_custom_file_type").css('display', 'block');
                                        SPL.$.each(data.prod_field_value, function (arrayID, dataDetail) {
                                            SPL.appendProductCustomField(dataDetail);
                                        });
                                    }
                                    if (data.seller_field_value) {
                                        SPL.$(".wk_seller_custom_detail").css('display', 'block');
                                        SPL.$.each(data.seller_field_value, function (arrayID, dataDetail) {
                                            SPL.appendSellerCustomField(dataDetail);
                                        });
                                    }
                                }
                            }
                            /* CutomeFieldDetailCallback callback task ends */

                            /* getreviews callback task starts */
                            if (SPL.$.inArray('getreviews', SPL.request_arr) != -1) {
                                data = response_data.getreviews;
                                if (data != 'false' && data !== "product_not_found")
                                    SPL.$('body').find('#seller-policy-tab').html(data);
                            }
                            /* getreviews callback task ends */

                            /* getdeliveryday callback task starts */
                            if (SPL.$.inArray('getdeliveryday', SPL.request_arr) != -1) {
                                data = response_data.getdeliveryday;
                                if (data != 'false' && data !== "product_not_found")
                                    SPL.$('body').find('#wk_delivery_day_div').html(data);
                            }
                            /* getdeliveryday callback task ends */

                            
                                SPL.$("body").on("change","#wk_store_pickup_locations",function(){

                                    if(SPL.$(this).find("option:selected").data('use_location_for_product') == 1 && SPL.$(this).find("option:selected").data('inventory_policy') == 0 && SPL.$(this).find("option:selected").data('location_wise_track_inventory') == 1  ){

                                        console.log(SPL.$(this).find("option:selected").data('max-qty'));

                                        if(SPL.$(this).find("option:selected").data('max-qty') < 1 ){
                                            console.log(SPL.$(this).find("option:selected").data('max-qty'))
                                            SPL.$("#wk_pickup_location_error").html("This location does not have quantity");
                                            SPL.$(".store-pickup-add-disabled").css({"pointer-events": "none", "opacity": "0.5"});

                                        }else{
                                            SPL.$("#wk_pickup_location_error").html("");
                                            SPL.$(".store-pickup-add-disabled").css({"pointer-events": "all", "opacity": "1"});


                                        }
                                    }
                                })
                              

                                SPL.$("body").on('change', '.store_pickup_location_class', function () {
                                    location.reload();
                                });


                                SPL.$("body").on("click","input[name='properties[store_pickup]']",function(){
                                    
                                    if(SPL.$("#wk_store_pickup_locations").find("option:selected").data('use_location_for_product') == 1 && SPL.$("#wk_store_pickup_locations").find("option:selected").data('inventory_policy') == 0 && SPL.$("#wk_store_pickup_locations").find("option:selected").data('location_wise_track_inventory') == 1  ){

                                        if ((SPL.$(this).val() == "YES") && SPL.$('#wk_store_pickup_locations').find("option").data('max-qty') < 1 ) {
                                            
                                            SPL.$("#wk_pickup_location_error").text("This location does not have quantity");
                                            SPL.$(".store-pickup-add-disabled").css({"pointer-events": "none", "opacity": "0.5"});


                                        }else{
                                            SPL.$("#wk_pickup_location_error").text("");
                                            SPL.$(".store-pickup-add-disabled").css({"pointer-events": "all", "opacity": "1"});

                                        }
                                    }
                                })
                                    
                            /* hasStorePickupDiv key for store pickup starts */
                            if (SPL.$.inArray('hasStorePickupDiv', SPL.request_arr) != -1) {
                                data = response_data.hasStorePickupDiv;
                                // var use_location_for_product = data.use_location_for_product;

                                var min_distance = 0;
                                if (data != undefined && data != false) {
                                    var label_details = null;
                                    if (data.label_details != null)
                                        label_details = SPL.$.parseJSON(data.label_details);

                                    var pickup_locations = null;
                                    var display_location_name = data.display_location_name;
                                    if (data.pickup_locations != undefined && data.pickup_locations != false)
                                        pickup_locations = data.pickup_locations;
                                    SPL.hyperlocal_enable = data.hyperlocal_enable;
                                    SPL.show_multiple_shipping_on_product_page = data.show_multiple_shipping_on_product_page;
                                    SPL.datepicker_storepickup = data.datepicker_storepickup;

                                    var pickup_locations_html = '';
                                    var no_location = false;
                                    var count_loc = 0;
                                    SPL.country_code = false;
                                    if (pickup_locations) {
                                        pickup_locations_html += "<select id='wk_store_pickup_locations' disabled='disabled' style='display:none;' name='properties[store_pickup_address]'>";
                                        var wk_customer_location = window.localStorage.getItem('wk_customer_location');
                                        var zero_distance = true;
                                        if (wk_customer_location && wk_customer_location.length != 0)
                                            wk_customer_location = JSON.parse(wk_customer_location);
                                        SPL.$.each(pickup_locations, function (id, location) {
                                            if (data.use_hyperlocation == 0) {

                                                // pickup_locations_html +="<option >Please</option>";
                                                pickup_locations_html += "<option value='" + location.address + "'";
                                                if (display_location_name == 1)
                                                    pickup_locations_html += " data-value='" + location.location_name +
                                                     "' data-max-qty='"+location.location_wise_variant_quantity+
                                                     "' data-use_location_for_product='"+location.use_location_for_product+
                                                   
                                                    "' data-inventory_policy='"+location.inventory_policy+
                                                 
                                                    "' data-location_wise_track_inventory='"+location.location_wise_track_inventory+
                                                    "'>" + 
                                                    
                                                    location.location_name + " - ";
                                                else
                                                    pickup_locations_html += ">";
                                                pickup_locations_html += location.address + "</option>";
                                                count_loc++;
                                            } else {
                                                if (wk_customer_location && wk_customer_location.length != 0 && location.latitude != 0 && location.longitude != 0) {
                                                    distance = SPL.distance(location.latitude, location.longitude, wk_customer_location.lat, wk_customer_location.lng);
                                                    if (parseInt(location.max_delv_dist) >= distance) {
                                                        if ((distance <= min_distance || min_distance == 0 || distance == 0) && zero_distance) {
                                                            min_distance = distance;
                                                            // pickup_locations_html += "<option value='" + location.address + "'data-value='"+ location.location_name +"' selected>" +location.location_name + "" + location.address + "</option>";
                                                            pickup_locations_html += "<option value='" + location.address + "'";
                                                            if (display_location_name == 1)
                                                                pickup_locations_html += " data-value='" + location.location_name + "' selected>" + location.location_name + " - ";
                                                            else
                                                                pickup_locations_html += " selected>";
                                                            pickup_locations_html += location.address + "</option>";
                                                            if (distance == 0)
                                                                zero_distance = false;
                                                        } else {
                                                            pickup_locations_html += "<option value='" + location.address + "'";
                                                            if (display_location_name == 1)
                                                                pickup_locations_html += " data-value='" + location.location_name + "'>" + location.location_name + " - ";
                                                            else
                                                                pickup_locations_html += ">";
                                                            pickup_locations_html += location.address + "</option>";
                                                        }
                                                        count_loc++;
                                                    }
                                                } else {
                                                    pickup_locations_html += "<option value='" + location.address + "'";
                                                    if (display_location_name == 1)
                                                        pickup_locations_html += " data-value='" + location.location_name + "'>" + location.location_name + " - ";
                                                    else
                                                        pickup_locations_html += ">";
                                                    pickup_locations_html += location.address + "</option>";
                                                    count_loc++;
                                                }
                                            }

                                        });
                                        if (count_loc == 0 && SPL.addToCartDisabled == false) {
                                            pickup_locations_html = '';
                                            SPL.$(".wk_hyperlocal").attr('disabled', 'disabled');
                                            SPL.$('#wk_product_available').html('<p style="color:#FF0000";>' + seller_not_deliver + '</p>');
                                            SPL.addToCartDisabled = true;
                                        }
                                        pickup_locations_html += "</select><div id='wk_pickup_location_error' style='color:red;padding:5px 10px' ></div>";
                                        if (display_location_name == 1)
                                            pickup_locations_html += "<input id='wk_pickup_location_name' type='hidden' name='properties[store_pickup_location_name]'>";
                                    }

                                    var html = "";
                                    if (data.mode == 0 && data.config_for == 1) {
                                        /* Both store pickup and delivery, for all products */
                                        html += "<h2>" + ((label_details == null) ? "Want Product As" : label_details['Want Product As']) + "</h1>";
                                        html += "<input type='radio' name='properties[store_pickup]' value='NO' style='min-height:0;'";
                                        if (data.is_default == 0) { /* Delivery */
                                            html += " checked='checked'";
                                            if (data.show_multiple_shipping_on_product_page === true) {
                                                if (data.hyperlocal_enable === true) {

                                                    SPL.setCustomerData();
                                                } else {
                                                    SPL.country_code = true;
                                                    SPL.getAllCountry();
                                                }
                                            }
                                        }
                                        html += "/>&nbsp;" + ((label_details == null) ? "Delivery" : label_details['Delivery']) + "<br><span class='delivery_option_span'><input type='radio' name='properties[store_pickup]' value='YES' style='min-height:0;'";
                                        if (data.is_default == 1) /* store pickup */ {
                                            html += " checked='checked'";

                                            SPL.$("#wk_shipping_calculate_div").attr('disabled', 'disabled').hide();
                                        }
                                        html += "/>&nbsp;" + ((label_details == null) ? "Store Pickup" : label_details['Store Pickup']) + "</span><br>";
                                        html += pickup_locations_html;
                                    } else if (data.mode == 0 && data.config_for == 2) {
                                        /* Both store pickup and delivery, for specifc products */
                                        if (data.store_pickup_for == 0) {
                                            /* Both store pickup and delivery */
                                            html += "<h2>" + ((label_details == null) ? "Want Product As" : label_details['Want Product As']) + "</h1>";
                                            html += "<input type='radio' name='properties[store_pickup]' value='NO' style='min-height:0;'";
                                            if (data.is_default == 0) /* Delivery */ {
                                                html += " checked='checked'";
                                                if (data.show_multiple_shipping_on_product_page === true) {
                                                    if (data.mp_shipping_type == 1) {
                                                        // console.log("country wise");
                                                    } else if (data.mp_shipping_type == 2) {
                                                        //console.log("zone wise");
                                                    }
                                                    if (data.hyperlocal_enable === true) {

                                                        SPL.setCustomerData();
                                                    } else {
                                                        SPL.country_code = true;
                                                        SPL.getAllCountry();
                                                    }
                                                }
                                            }
                                            html += "/>&nbsp;" + ((label_details == null) ? "Delivery" : label_details['Delivery']) + "<br><span class='delivery_option_span'> <input type='radio' name='properties[store_pickup]' value='YES' style='min-height:0;'";
                                            if (data.is_default == 1) /* store pickup */ {

                                                html += " checked='checked'";
                                                SPL.$("#wk_shipping_calculate_div").attr('disabled', 'disabled').hide();
                                            }
                                            html += "/>&nbsp;" + ((label_details == null) ? "Store Pickup" : label_details['Store Pickup']) + "</span><br>";
                                            html += pickup_locations_html;
                                        }
                                        if (data.store_pickup_for == 1) {
                                            /* only store pickup */

                                            html += "<span class='delivery_option_span'> <input type='radio' name='properties[store_pickup]' value='YES' checked='checked' style='min-height:0;'/>" + ((label_details == null) ? "Store Pickup" : label_details['Store Pickup']) + "</span><br><p><strong>Note : </strong>" + ((label_details == null) ? "Only Store Pickup Available For This Product" : label_details['Only Store Pickup Available For This Product']) + "</p>";
                                            html += pickup_locations_html;
                                        }
                                        if (data.store_pickup_for == 2) {
                                            /* only delivery */
                                            html += "<input type='radio' name='properties[store_pickup]' value='NO' checked='checked' style='min-height:0;'/>" + ((label_details == null) ? "Delivery" : label_details['Delivery']) + "<br><p><strong>Note : </strong>" + ((label_details == null) ? "Only Delivery Available For This Product" : label_details['Only Delivery Available For This Product']) + "</p>";
                                            if (data.show_multiple_shipping_on_product_page === true) {

                                                if (data.hyperlocal_enable === true) {

                                                    SPL.setCustomerData();
                                                } else {
                                                    SPL.country_code = true;
                                                    SPL.getAllCountry();
                                                }
                                            }

                                        }

                                    } else {
                                        html += "<span class='delivery_option_span'> <input type='radio' name='properties[store_pickup]' value='YES' checked='checked' style='min-height:0;'/>" + ((label_details == null) ? "Store Pickup" : label_details['Store Pickup']) + "</span><br><p><strong>Note : </strong>" + ((label_details == null) ? "Only Store Pickup Available For This Product" : label_details['Only Store Pickup Available For This Product']) + "</p>";
                                        html += pickup_locations_html;
                                    }
                                    if (typeof data.check_location_count == 'undefined' || data.check_location_count == false) {
                                        if (count_loc < 1 && data.multilocation_enabled) {
                                            html += "<style>.delivery_option_span{display:none}</style><script>document.querySelector('.delivery_option_span input[type=radio]').disabled = true;</script>";
                                        }
                                        SPL.$("#wk_store_pickup_div").html(html);
                                        SPL.appendStorePickupAddresses(display_location_name);

                                       
                                        if(SPL.$("#wk_store_pickup_locations").find("option").data('max-qty') < 1){
                                            
                                            if(SPL.$("#wk_store_pickup_locations").find("option:selected").data('use_location_for_product') == 1 && SPL.$("#wk_store_pickup_locations").find("option:selected").data('inventory_policy') == 0 && SPL.$("#wk_store_pickup_locations").find("option:selected").data('location_wise_track_inventory') == 1  ){
                                                
                                                if (SPL.$('input[name="properties[store_pickup]"]:checked').val() == "YES") {
                                                    SPL.$("#wk_pickup_location_error").text("This location does not have quantity");
                                                  
                                                    SPL.$(".store-pickup-add-disabled").css({"pointer-events": "none", "opacity": "0.5"});
                                                    return false;
                                                }
                                            }
                                        }
                                        
                                    }
                                }
                            }
                            /* hasStorePickupDiv key for store pickup ends*/

                            if (SPL.$.inArray('geSellerDescription', SPL.request_arr) != -1 && response_data.geSellerDescription != "") {
                                SPL.$("#wk_seller_description").html(response_data.geSellerDescription);
                                SPL.$(".wk_seller_description").html(response_data.geSellerDescription);
                            }

                            if (SPL.$.inArray('getSellerShippingZones', SPL.request_arr) != -1 && response_data.getSellerShippingZones != "") {
                                if (SPL.$(".wk_shipping_zones").length > 0)
                                    SPL.$(".wk_shipping_zones").html(response_data.getSellerShippingZones);
                                else if (SPL.$("#wk_shipping_zones").length > 0)
                                    SPL.$("#wk_shipping_zones").html(response_data.getSellerShippingZones);
                            }

                            if (SPL.$.inArray('getSellerAvailablity', SPL.request_arr) != -1) {
                                var wk_customer_location = JSON.parse(window.localStorage.getItem('wk_customer_location'));
                                if (response_data.getSellerAvailablity == false) {
                                    if (wk_customer_location && wk_customer_location.length != 0) {
                                        SPL.$('#wk_product_available').html('<p style="color:#FF0000";>' + seller_not_deliver + '</p>');
                                    } else {
                                        SPL.$('#wk_product_available').html('<div style="display:block"><p style="color:#FF0000";>' + delv_location_req + '</p><button type="button" class="btn" onClick="window.location.href = window.location.origin">' + add_location_btn + '</button></div>');
                                    }
                                } else if (SPL.addToCartDisabled == false) {
                                    SPL.addToCartDisabled = true;
                                    SPL.$(".wk_hyperlocal").attr('disabled', false);
                                }
                            }

                            if (SPL.$.inArray('getMinPurchaseQuantity', SPL.request_arr) != -1) {
                                if (response_data.getMinPurchaseQuantity) {
                                    if (response_data.getMinPurchaseQuantity['value'] == false || typeof (response_data.getMinPurchaseQuantity['value'][0]) == "undefined") { } else {
                                        var min_purchase_quantity = response_data.getMinPurchaseQuantity['value'][0].min_purchase_quantity;
                                        let moq_type = response_data.getMinPurchaseQuantity['moq_type'];

                                        //if (moq_type == 1) {

                                            if (min_purchase_quantity && SPL.$('#Quantity-product-template').length) {
                                                if (min_purchase_quantity == 0)
                                                    min_purchase_quantity = 1;
                                                SPL.$("#Quantity-product-template").attr('min', min_purchase_quantity).attr('value', min_purchase_quantity);
                                            } else if (min_purchase_quantity && SPL.$(".wk_qty_selector").length) {
                                                if (min_purchase_quantity == 0)
                                                    min_purchase_quantity = 1;
                                                SPL.$(".wk_qty_selector").attr('min', min_purchase_quantity).attr('value', min_purchase_quantity);
                                            }
                                       // }

                                        if (SPL.$(".wk_qty_selector_value").length && typeof (min_purchase_quantity) != "undefined" && min_purchase_quantity > 1 && SPL.$(".min_purchase_qty_div").length == 0) {
                                            SPL.$(".wk_qty_selector_value").show();
                                            SPL.$(".qty_value").html(min_purchase_quantity);
                                        }
                                    }
                                }
                            }

                            if (SPL.$.inArray('getSellerBadge', SPL.request_arr) != -1) {
                                if (response_data.getSellerBadge) {
                                    if (SPL.$('#wk_seller_badge_div').length)
                                        SPL.$('#wk_seller_badge_div').html(response_data.getSellerBadge);
                                    else if (SPL.$('.wk_seller_badge_div').length)
                                        SPL.$('.wk_seller_badge_div').html(response_data.getSellerBadge);
                                }
                            }

                            if (SPL.$.inArray('getSellerMinPurchaseAmount', SPL.request_arr) != -1) {
                                if (!SPL.$.isEmptyObject(response_data.getSellerMinPurchaseAmount)) {
                                    let mao_label = wk_label_minimum_purchase_amount + " " + response_data.getSellerMinPurchaseAmount.currency_details.currency_symbol + "" + response_data.getSellerMinPurchaseAmount.minimum_purchase_value;
                                    SPL.$("#wk_product_mpa").append("<span class='wk-mpa'>" + mao_label + "</span>");
                                }
                            }
                        }

                        if (SPL.$.inArray('getPayWhatYouWantStatus', SPL.request_arr) != -1) {
                            SPL.$(".wk_choice_pay").removeAttr("disabled");
                            if (response_data.getPayWhatYouWantStatus == 1) {
                                SPL.original_price = 0;
                                var variant_wise_price = meta['product']['variants'].map(function (value) {
                                    var id = [];
                                    id[value['id']] = value['price'];
                                    return id;
                                });
                                SPL.updateSPLVariantId();
                                SPL.$(".wk_choice_pay").on('click', function (e) {
                                    var original_price = 0;

                                    if (SPL.main_id_variant == 0) {
                                        SPL.main_id_variant = Object.keys(variant_wise_price[0]);
                                    }

                                    original_price = variant_wise_price.filter(function (value) {
                                        if (Object.keys(value) == parseInt(SPL.main_id_variant)) {
                                            SPL.original_price = Object.values(value);
                                        }
                                    })

                                    SPL.original_price = SPL.original_price / 100;
                                    // var qty = SPL.$(".wk_qty_selector").val();
                                    var customer_pay_amount = SPL.$("#wk_custom_price").val();
                                    if (!customer_pay_amount || customer_pay_amount < SPL.original_price || customer_pay_amount == "") {
                                        e.preventDefault();
                                        SPL.$(".wk_pay_what_you_want").css("visibility", "hidden");
                                        SPL.$(".wk_error_message").css("visibility", "visible");
                                        SPL.$(".wk_choice_pay").attr("disabled", "disabled");
                                        SPL.$("#wk_var_price").text(SPL.original_price);
                                        setTimeout(function () {
                                            SPL.$(".wk_pay_what_you_want").css("visibility", "visible");
                                            SPL.$(".wk_error_message").css("visibility", "hidden");
                                            SPL.$(".wk_choice_pay").removeAttr("disabled");
                                        }, 2000);

                                    }

                                    SPL.$("#wk_variant_id").val(SPL.main_id_variant);
                                    SPL.$("#wk_custom_price").val((customer_pay_amount));
                                })
                                SPL.$("#wk_custom_price").on('change', function (e) {
                                    SPL.$(".wk_pay_what_you_want").css("visibility", "visible");
                                    SPL.$(".wk_error_message").css("visibility", "hidden");
                                })
                            }
                        }

                        if (SPL.$.inArray('getSellerTimeSlot', SPL.request_arr) != -1) {
                            if (response_data.getSellerTimeSlot) {
                                SPL.sellerTimeSlot(response_data.getSellerTimeSlot);
                            }

                        }

                        if (SPL.$.inArray('getPostcodeWiseShipping', SPL.request_arr) != -1) {
                            console.log(response_data.getPostcodeWiseShipping);
                            data = response_data.getPostcodeWiseShipping;
                            if (data.getPostcodeWiseShipping) {
                                //console.log("enable_country_in_postcode :: " + data.enable_country_in_postcode);
                                SPL.enable_country_in_postcode = data.enable_country_in_postcode;

                                if (SPL.enable_country_in_postcode == 1)
                                    SPL.getAllCountry();
                                else {
                                    var html = "";
                                    html += '<div id="get_postcode" class="input-group mb-3"><input type="text" class="form-control" id="wk_postcode" placeholder="Enter Postcode"><div class="input-group-append"><button id="wk_check_shipping" class="btn btn-outline-secondary" type="button">Shipping</button></div></div>';
                                    SPL.$("#wk_postcode_wise_shipping").append(html);

                                    SPL.$("body").find("[id='wk_check_shipping']").on('click', function () {

                                        var error = "";
                                        SPL.wk_postcode = SPL.$("body").find("#wk_postcode").val();

                                        if (!SPL.wk_postcode.trim()) {
                                            if (typeof (postcode_required) !== 'undefined')
                                                postcode_required = (postcode_required != '' && postcode_required != null) ? postcode_required : 'Postalcode is required';
                                            else
                                                var postcode_required = 'Postalcode is required';
                                            error += "<div style='color:red;'>" + postcode_required + "</div>";
                                            html += error;
                                            SPL.$("#wk_postcode_wise_shipping").html(html);
                                        } else if (typeof SPL.wk_postcode != "undefined" && SPL.wk_postcode != "") {
                                            SPL.quantity = SPL.$(".wk_qty_selector").val();

                                            var key = SPL.wk_postcode + "_" + SPL.main_id_variant + "_" + SPL.quantity;
                                            var shipping_method = JSON.parse(sessionStorage.getItem(key));

                                            if (!shipping_method)
                                                SPL.getShippingMethod();
                                            else {
                                                var ship_html = "<table id ='shipping_table'><strong><tr><th>No.</th><th>Shipping Name</th><th>Price</th></tr><strong>";
                                                SPL.$.each(shipping_method, function (key, value) {
                                                    ship_html += "<tr><td>" + (key + 1) + "</td><td>" + value.service_name + "</td><td>" + value.range_price + "</td></tr>";

                                                });
                                                ship_html += "</table>";
                                                SPL.$("#shipping_table").remove();
                                                SPL.$("#error_div").remove();
                                                SPL.$("#wk_postcode_wise_shipping").append(ship_html);
                                            }
                                        }
                                    });
                                }
                            }
                            if (SPL.$.inArray('hasStorePickupDiv', SPL.request_arr) != -1) {

                                var is_store_pickup = SPL.$("#wk_store_pickup_div").find('input[type="radio"]:checked').val();
                                SPL.postcodewise_and_storepickup_active = 1;
                                if (is_store_pickup == "YES")
                                    SPL.$("#wk_postcode_wise_shipping").hide();

                            }
                        }

                        if (SPL.$.inArray('getMultipleShippingOnProductPage', SPL.request_arr) != -1) {


                            if (response_data.getMultipleShippingOnProductPage == "hyperlocal_active") {
                                SPL.wk_multiple_shipping_div = 1;
                                SPL.setCustomerData();

                            } else if (response_data.getMultipleShippingOnProductPage)
                                SPL.getAllCountry();

                        }

                        if (SPL.$.inArray('AllowCountrOriginOnProduct', SPL.request_arr) != -1) {
                            if (response_data.AllowCountrOriginOnProduct)
                                SPL.$("#seller_country_origin_div").show();

                        }
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        console.log(xhr.status);
                        console.log(thrownError);
                    }
                });
        };

        SPL.activeCustomerInfo = function (email_id) {
            var e1 = SPL.$("#submitbtn");
            var e2 = SPL.$('#wkbtnonload');
            e1.css('display', 'none');
            e2.css('display', 'block');
            return SPL.$.ajax({
                url: SPL.api_url + 'index.php?p=customeractivelink',
                type: "GET",
                async: true,
                cache: false,
                jsonpCallback: 'activeCustomerCallback',
                contentType: "application/json",
                dataType: "jsonp",
                data: {
                    shop: SPL.shop_name,
                    customer_email: email_id,
                },
                success: function (data) {
                    e1.css('display', 'block');
                    e1.css('margin', '0 auto');
                    e2.css('display', 'none');
                    if (data.active == 1) {
                        SPL.$("#activation_error").css('display', 'block');
                        SPL.$("#activation_error ul").html('<li>Oops! <br />Your email id is not registered with us, you are required to sign up.<br /><a href="/account/register">Click here</a> to Sign up/ create account.</li>')

                    } else if (data.active == 2) {
                        SPL.$("#activation_error").css('display', 'block');
                        SPL.$("#activation_error ul").html('<li>Hey! <br />You have already activated your account<br />If you are still not able to login then <a href="/account/login#recover">click here</a> to reset your password</li>')

                    } else if (data.active == 3) {
                        SPL.$("#activation_error").html('');
                        SPL.$("#activation_error").css('display', 'none');
                        SPL.$("#activation_success").css('display', 'block');
                        SPL.$("#activation_success ul").html('<li>Hey! An activation mail has been sent to your registered email id.Please check your spam folder as well.<br />Still if you have not received the email, write us at support@fashionandyou.com</li>')


                    } else if (data.active == 0) {
                        console.log('Merchant is not active');
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    console.log(xhr.status);
                    console.log(thrownError);
                }
            });
        };

        SPL.appendProductCustomField = function (dataDetail) {
            if (dataDetail.custom_value == '')
                dataDetail.custom_value = 'Not Available';

            var html = '';
            var file_html = '';
            if (/^\<a.*\>.*\<\/a\>/i.test(dataDetail.custom_value))
                file_html = file_html + '<div id="wk_custom_file_type_' + dataDetail.display_name + '"><p><strong>' + dataDetail.display_name + '</strong><span> - </span>' + dataDetail.custom_value + '</p></div>';
            else
                html = html + '<p><strong>' + dataDetail.display_name + '</strong><span> - </span>' + dataDetail.custom_value + '</p>';
            SPL.$(".wk_product_custom_detail").append(html);
            SPL.$(".wk_product_custom_file_type").append(file_html);
        }


        SPL.appendSellerCustomField = function (dataDetail) {
            if (dataDetail.custom_value == '')
                dataDetail.custom_value = 'Not Available';
            var html = '';
            html = html + '<p><strong>' + dataDetail.display_name + '</strong><span> - </span>' + dataDetail.custom_value + '</p>';
            SPL.$(".wk_seller_custom_detail").append(html);
        }

        SPL.checkMinimumPurchase = function (callback) {

            var vendor_wise_prod = [];
            var vendor_wise_name = [];
            var checkout_btn = SPL.$("input[name='checkout']");
            var split_cart_feature = false;
            if (checkout_btn.length == 0) {
                checkout_btn = SPL.$("button.wk-buy");
                if (checkout_btn.length) {
                    split_cart_feature = true;
                    vendor_wise_prod = SPL.$(".wk-buy").map(function () {
                        return SPL.$(this).attr('data-params');
                    }).get();
                    vendor_wise_name = SPL.$(".wk-buy").map(function () {
                        return SPL.$(this).attr('data-vendor');
                    }).get();
                } else {
                    checkout_btn = SPL.$("button[name='checkout']");
                }
            }
            if (checkout_btn.length) {
                checkout_btn.css("display", "none");
                SPL.$(".wk-additional-checkout-btn").css("display", "none");
                var wk_addon_count = SPL.$(".wk_addon_count").length;
                SPL.$.get('/cart.js', function (cart_details) {
                    if (cart_details) {
                        var currency_code = cart_details.currency;
                        var cart_arr = {};
                        var key_arr = {};
                        var prod_wise_qty = [];
                        SPL.$.each(cart_details.items, function (i, item) {
                            var arr = {};
                            var arr1 = {};

                            arr['product_title'] = item.product_title;
                            arr['title'] = item.variant_title;
                            arr['quantity'] = item.quantity;
                            arr['product_id'] = item.product_id;
                            arr['variant_id'] = item.variant_id;
                            arr['price'] = item.price;
                            arr['properties'] = item.properties;
                            arr1['quantity'] = item.quantity;
                            arr1['key'] = item.key;
                            arr1['product_id'] = item.product_id;
                            key_arr[item.variant_id] = arr1;
                            cart_arr[i] = arr;
                            if (prod_wise_qty[item.product_id])
                                prod_wise_qty[item.product_id] += item.quantity;
                            else
                                prod_wise_qty[item.product_id] = item.quantity;
                        });

                        var selected_tag_dom = SPL.$("body").find("[data-wk_slot_subtotal='wk_slot']");
                        var selected_tag = selected_tag_dom.attr("data-wk_selected_tag");
                        var route_insurance = 0;
                        if (SPL.$("body").find("#RouteWidget").length || SPL.$("body").find(".WkRouteWidget").length)
                            route_insurance = 1;
                        var wk_preorder_count = SPL.$(".wk_po_count").length;

                        SPL.$.ajax({
                            url: SPL.api_url + "index.php?p=ajax_minimum_purchase",
                            type: "POST",
                            crossDomain: true,
                            dataType: "json",
                            data: {
                                shop: Shopify.shop,
                                cart_details: cart_arr,
                                cart_token: cart_details.token,
                                selected_tag: selected_tag,
                                pay_what_you_want: SPL.pay_what_you_want,
                                wk_addon_count: wk_addon_count,
                                route_insurance: route_insurance,
                                wk_preorder_count: wk_preorder_count,
                                callback: "getMinimumPurchase"
                            },
                            success: function (data) {
                                var create_draft = false;
                                if (data == 'sww' || data == 'shop_not_found' || data.message == 'not_found') {
                                    // nothing to do here
                                } else {

                                    if (data.min_pur_qty_arr != undefined && data.min_pur_qty_arr.length != 0) {
                                        vendor_wise_name = minPurchaseQuantityFuntion(data.min_pur_qty_arr, key_arr, split_cart_feature, vendor_wise_prod, checkout_btn, vendor_wise_name, data.moq_level, prod_wise_qty);
                                    }

                                    if (data.store_closed != undefined && data.store_closed != "") { //seller time slot restrict closed store checkout
                                        SPL.store_closed_list = "";
                                        SPL.$.each(data.store_closed, function (seller_id, vendor_name) {
                                            if (SPL.store_closed_list == "")
                                                SPL.store_closed_list = vendor_name;
                                            else
                                                SPL.store_closed_list += (", " + vendor_name);

                                            if(typeof split_cart_type != 'undefined' && split_cart_type == 1)
                                            {
                                                var index = vendor_wise_name.indexOf(sellers[vendor_name]);
                                            }
                                            else if(typeof split_cart_type != 'undefined' && split_cart_type == 2 && (sellers[vendor_name] == 'anno' || jQuery.inArray(sellers[vendor_name],exception_country) != -1))
                                            {
                                                var index = vendor_wise_name.indexOf('anno');
                                            }
                                            else
                                            {
                                                var index = vendor_wise_name.indexOf(vendor_name);
                                            }
                                            
                                            if (index != -1) {
                                                vendor_wise_name.splice(index, 1);

                                            }
                                            vendor_name_id = vendor_name.split(" ");
                                            vendor_name_id = vendor_name_id.join("_");
                                            console.log(vendor_name_id);
                                            if (SPL.$("*[id='wk_cart_error_" + vendor_name_id + "']").length > 0) {
                                                wk_cart_error_labels = SPL.$("*[id='wk_cart_error_" + vendor_name_id + "']").text();
                                                SPL.$("*[id='wk_cart_error_" + vendor_name_id + "']").text(wk_cart_error_labels);
                                                SPL.$("*[id='wk_cart_error_" + vendor_name_id + "']").show().css("color", "red");
                                            }
                                        })
                                        wk_cart_error_labels = SPL.$("#wk_cart_error").text();
                                        SPL.$("#wk_cart_error").text(SPL.store_closed_list + " " + wk_cart_error_labels);

                                        if (!split_cart_feature) {
                                            SPL.$("#wk_cart_error").show().css("color", "red");
                                            SPL.main_checkout_condition = false;
                                        }

                                    }

                                    /** minimum purchase code */

                                    if (SPL.$('#wk_min_qty_error').length == 0) {
                                        if (SPL.$('#wk_minimum_purchase_div').length && data.seller_detail && Object.keys(data.seller_detail).length && checkout_btn.length > 0) {

                                            var minimum_purchase_table = '';
                                            if (SPL.$('.wk_minimum_purchase_table').length == 0)
                                                minimum_purchase_table += '<table class="wk_minimum_purchase_table"><thead><td>' + wk_label_store_name + '</td><td>' + wk_label_product_name + '</td><td>' + wk_label_checkout_condition + '</td></thead><tbody>';
                                            var seller_name = seller_store_name = minimum_purchase = price = amount_diff = currency = false;
                                            var show_checkout = true;
                                            var split_cart_seller = [];
                                            SPL.$.each(data.seller_detail, function (seller_id, items) {
                                                var checkout_condition = "Fail";
                                                var product_title = [];
                                                var product_price = [];
                                                SPL.$.each(items, function (key, line_item) {
                                                    currency = line_item['currency'];
                                                    seller_name = line_item['seller_name'];
                                                    seller_store_name = line_item['seller_store_name'];
                                                    minimum_purchase = line_item['minimum_purchase'];
                                                    product_title.push(line_item['product_title']);
                                                    product_price.push(line_item['price'] * line_item['quantity']);
                                                });

                                                price = product_price.reduce(getSum);
                                                var pass_min_condition = false;

                                                if (price >= minimum_purchase) {
                                                    checkout_condition = wk_label_pass;
                                                    pass_min_condition = true;
                                                    if (split_cart_feature)
                                                        split_cart_seller.push(seller_store_name);
                                                } else {
                                                    amount_diff = (minimum_purchase - price) / 100;
                                                    checkout_condition = wk_label_fail + " " + currency + "" + amount_diff + " " + wk_label_need_added;
                                                    show_checkout = false;
                                                    SPL.main_checkout_condition = false;
                                                    if(typeof split_cart_type != 'undefined' && split_cart_type == 1)
                                                    {
                                                        var index = vendor_wise_name.indexOf(sellers[seller_store_name]);
                                                    }
                                                    else if(typeof split_cart_type != 'undefined' && split_cart_type == 2 && (sellers[seller_store_name] == 'anno' || jQuery.inArray(sellers[seller_store_name],exception_country) != -1))
                                                    {
                                                        var index = vendor_wise_name.indexOf('anno');
                                                    }
                                                    else
                                                    {
                                                        var index = vendor_wise_name.indexOf(seller_store_name);
                                                    }
                                                    if (index != -1)
                                                        vendor_wise_name.splice(index, 1);
                                                }
                                                if(pass_min_condition){
                                                    minimum_purchase_table += '<tr><td>' + seller_store_name + '</td><td>' + product_title.join() + '</td><td class="wk_success" >' + checkout_condition + '</td></tr>';
                                                }else{
                                                    minimum_purchase_table += '<tr><td>' + seller_store_name + '</td><td>' + product_title.join() + '</td><td class="wk_fail">' + checkout_condition + '</td></tr>';
                                                }
                                            });
                                            if (show_checkout) {
                                                if (SPL.$('.wk_minimum_purchase_table').length == 0) {

                                                    SPL.$('.wk-minimum').css("display", "block");
                                                    SPL.$('#wk_minimum_purchase_div').attr("data-fail", "false");
                                                } else {
                                                    if (SPL.$('#wk_minimum_purchase_div').attr("data-fail") == "true") {
                                                        SPL.main_checkout_condition = false;
                                                        /** not need to show checkout btn */
                                                    } else {

                                                        SPL.$('.wk-minimum').css("display", "block");
                                                        SPL.$('#wk_minimum_purchase_div').attr("data-fail", "false");
                                                    }
                                                }
                                            } else {

                                                SPL.$('#wk_minimum_purchase_div').attr("data-fail", "true");
                                            }


                                            function getSum(total, num) {
                                                return parseInt(total) + parseInt(num);
                                            }
                                            if (SPL.$('.wk_minimum_purchase_table').length == 0) {
                                                minimum_purchase_table += '</tbody></table>';
                                                SPL.$('#wk_minimum_purchase_div').html(minimum_purchase_table);
                                            } else {
                                                SPL.$('.wk_minimum_purchase_table').append(minimum_purchase_table);
                                            }
                                            SPL.$('#wk_minimum_purchase_div').css("display", "block");
                                        } else if (SPL.$('.wk_minimum_purchase_table').length == 0 && SPL.$('.wk-text-danger').length == 0) {

                                        }
                                    }
                                }

                                if (SPL.$("body").find("#RouteWidget").length && (data.route_insurance && data.route_insurance.active)) {
                                    routeapp.get_quote(data.route_insurance.public_token, data.route_insurance.subtotal, currency_code, SPL.response_quote_api);
                                    create_draft = true;
                                }
                                if (data.po_line_items) {
                                    validatePreorerQuantity(data.po_line_items, vendor_wise_prod, vendor_wise_name, checkout_btn, split_cart_feature, key_arr, data.po_currency);
                                    create_draft = true;
                                }
                                if (data.pay_what_you_want != undefined && data.pay_what_you_want != "") {
                                    create_draft = true;
                                }

                                if (SPL.main_checkout_condition && !split_cart_feature) {

                                    checkout_btn.css("display", "inline-block");
                                    if (create_draft) {
                                        checkout_btn.replaceWith('<a href="javascript:void(0)" name="checkout" type="button" id="wk_checkout_btn" style="color:#fff;" class="btn checkout wk-minimum wk_checkout_btn ' + checkout_btn.prop("className") + '">' + wk_label_checkout_btn + ' </a>');
                                    }
                                    SPL.$(".wk-additional-checkout-btn").css("display", "block");
                                }
                                if (split_cart_feature) {
                                    splitCartVendorShow(vendor_wise_name);
                                }
                                return callback();
                            },
                            error: function (error) {

                            }
                        });
                    }
                    else
                        return callback();
                }, 'json');
            }
            else
                return callback();
        }

        SPL.appendStorePickupAddresses = function (display_location_name = 0) {
            var is_store_pickup = SPL.$("#wk_store_pickup_div").find('input[type="radio"]:checked').val();
            var location_name = SPL.$("#wk_store_pickup_locations").children("option:selected").attr('data-value')
            if (SPL.$('#wk_pickup_location_name').length > 0 && typeof location_name != 'undefined' && display_location_name == 1) {

                if (is_store_pickup === 'YES') {
                    SPL.$('#wk_pickup_location_name').val(location_name);
                    SPL.$("#wk_shipping").val('');
                    if (SPL.datepicker_storepickup == 1) {
                        SPL.$("#wk_shipping_date_div").show();
                        SPL.$("#wk_bring_pick_up_calendar_message").show();
                        SPL.$("#wk_bring_delivery_calendar_message").hide();
                        if (typeof $ == "function")
                            $("#wk_shipping_date").datepicker({ dateFormat: "dd-mm-yy" });
                    } else {
                        SPL.$("#wk_shipping_date_div").hide();
                        SPL.$("#wk_bring_pick_up_calendar_message,#wk_bring_delivery_calendar_message").hide();
                        SPL.$("#wk_shipping_date").val('');
                    }
                    if (SPL.postcodewise_and_storepickup_active == 1) {
                        SPL.$("#wk_postcode_wise_shipping").hide();
                    }
                } else
                    SPL.$('#wk_pickup_location_name').val('')
            }
            if (is_store_pickup === 'YES') {

                SPL.$("#wk_store_pickup_div").find('#wk_store_pickup_locations').removeAttr('disabled').show();
                SPL.$("#wk_shipping").val('');
                if (SPL.datepicker_storepickup == 1) {
                    SPL.$("#wk_shipping_date_div").show();
                    SPL.$("#wk_bring_pick_up_calendar_message").show();
                    SPL.$("#wk_bring_delivery_calendar_message").hide();
                    if (typeof $ == "function")
                        $("#wk_shipping_date").datepicker({ dateFormat: "dd-mm-yy" });
                } else {
                    SPL.$("#wk_shipping_date_div").hide();
                    SPL.$("#wk_shipping_date").val('');
                    SPL.$("#wk_bring_pick_up_calendar_message,#wk_bring_delivery_calendar_message").hide();
                }
                if (SPL.postcodewise_and_storepickup_active == 1) {
                    SPL.$("#wk_postcode_wise_shipping").hide();
                }
            }

            SPL.$("#wk_store_pickup_div").find('input[type="radio"]').on('change', function () {
                var is_store_pickup = SPL.$(this).val();

                if (is_store_pickup === 'YES') {
                    SPL.$('#wk_store_pickup_locations').removeAttr('disabled').show();
                    SPL.$("#wk_shipping").val('');
                    if (SPL.datepicker_storepickup == 1) {
                        SPL.$("#wk_shipping_date_div").show();
                        SPL.$("#wk_bring_pick_up_calendar_message").show();
                        SPL.$("#wk_bring_delivery_calendar_message").hide();
                        if (typeof $ == "function")
                            $("#wk_shipping_date").datepicker({ dateFormat: "dd-mm-yy" });
                    } else {
                        SPL.$("#wk_shipping_date_div").hide();
                        SPL.$("#wk_shipping_date").val('');
                        SPL.$("#wk_bring_pick_up_calendar_message,#wk_bring_delivery_calendar_message").hide();
                    }
                    if (SPL.show_multiple_shipping_on_product_page === true) {
                        if (SPL.hyperlocal_enable === true) {
                            SPL.$("#wk_store_pickup_div").find("#shipping_calculator_table").attr('disabled', 'disabled').hide();

                        } else {
                            SPL.$("#wk_shipping_calculate_div").attr('disabled', 'disabled').hide();
                        }
                    }
                    if (SPL.postcodewise_and_storepickup_active == 1) {
                        SPL.$("#wk_postcode_wise_shipping").hide();
                    }
                } else {
                    SPL.$('#wk_store_pickup_locations').attr('disabled', 'disabled').hide();
                    if (SPL.$('#wk_pickup_location_name').length > 0 && display_location_name == 1) {
                        SPL.$('#wk_pickup_location_name').val('')
                    }
                    if (SPL.show_multiple_shipping_on_product_page === true) {

                        if (SPL.hyperlocal_enable === true) {
                            SPL.setCustomerData();

                        } else {
                            if (SPL.country_code === false) {
                                SPL.country_code = true;
                                SPL.getAllCountry();
                            }
                        }
                        SPL.$("#wk_shipping_calculate_div").removeAttr('disabled').show();

                    }
                    if (SPL.postcodewise_and_storepickup_active == 1) {
                        SPL.$("#wk_postcode_wise_shipping").show();
                    }
                }
            });
            SPL.$("#wk_store_pickup_locations").on('change', function () {
                location_name = SPL.$("#wk_store_pickup_locations").children("option:selected").attr('data-value')
                var is_store_pickup = SPL.$("#wk_store_pickup_div").find('input[type="radio"]:checked').val();
                if (SPL.$('#wk_pickup_location_name').length > 0 && typeof location_name != 'undefined' && display_location_name == 1) {
                    if (is_store_pickup === 'YES')
                        SPL.$('#wk_pickup_location_name').val(location_name)
                    else
                        SPL.$('#wk_pickup_location_name').val('')
                }
            })
        }

        SPL.distance = function distance(lat1, lon1, lat2, lon2) {
            if ((lat1 == lat2) && (lon1 == lon2)) {
                return 0;
            } else {
                var radlat1 = Math.PI * lat1 / 180;
                var radlat2 = Math.PI * lat2 / 180;
                var theta = lon1 - lon2;
                var radtheta = Math.PI * theta / 180;
                var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
                if (dist > 1) {
                    dist = 1;
                }
                dist = Math.acos(dist);
                dist = dist * 180 / Math.PI;
                dist = dist * 60 * 1.1515;
                dist = dist * 1.609344;

                return dist;
            }
        }

        SPL.getCustomerData = function () {
            if (SPL.customer_email) {
                return SPL.$.ajax({
                    url: SPL.api_url + 'index.php?p=ajax_customer_data',
                    type: "GET",
                    async: true,
                    cache: false,
                    jsonpCallback: 'getCustomerData',
                    contentType: "application/json",
                    dataType: "jsonp",
                    data: {
                        shop: SPL.shop_name,
                        customer_email: SPL.customer_email
                    },
                    success: function (response_data) {

                        if (response_data.draft_order) {
                            if (SPL.handle_without_pagination != "account") {
                                var html = "<a href = '/pages/draft_orders' target = '_blank' class = 'view-draft-orders btn' > DRAFT ORDERS </a>";
                                SPL.$('#wk_draft_order_div').html(html);
                            } else {
                                var html = '<h2> Draft Orders</h2><table class="responsive-table"><thead><tr><th scope="col">Draft Order Id</th><th scope="col">Date</th><th scope="col">Amount</th><th scope="col">Action</th></tr></thead><tbody>';
                                SPL.$.each(response_data.draft_order, function ($key, $order) {
                                    html += '<tr><td>' + $order.draft_order_id + '</td><td>' + $order.date_add + '</td><td>' + $order.amount + '</td><td><a href="' + $order.invoice_url + '" target= "_blank" class=" pay_btn btn"> PAY </a></td>';
                                })
                                html += '</tbody><table>';
                                SPL.$('#wk_draft_order_div').html(html);
                            }
                        }

                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        console.log(xhr.status);
                        console.log(thrownError);
                    }
                });
            }
        }

        SPL.labelLoadjQuery = function (afterLoad) {
            return SPL.labelLoadScript("//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js", function () {
                SPL.$ = jQuery.noConflict(true);
                if (SPL.$(".wk-rateit").length) {
                    SPL.loadCss(SPL.api_url + "lib/rateyo/jquery.rateyo.min.css");
                    SPL.labelLoadScript(SPL.api_url + "lib/rateyo/jquery.rateyo.min.js", function () { });
                }

                if (SPL.$("#wk_shipping_date").length) {
                    SPL.loadCss("https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css");
                    SPL.labelLoadScript("https://code.jquery.com/ui/1.12.1/jquery-ui.js", function () { });
                }
                return afterLoad();
            });
        };

        SPL.labelLoadScript = function (url, callback) {
            var script;
            script = document.createElement("script");
            script.type = "text/javascript";

            if (script.readyState) {
                script.onreadystatechange = function () {
                    if (script.readyState === "loaded" || script.readyState === "complete") {
                        script.onreadystatechange = null;
                        return callback();
                    }
                };
            } else {
                script.onload = function () {
                    return callback();
                };
            }

            script.src = url;
            document.getElementsByTagName("head")[0].appendChild(script);
            return true;
        };

        SPL.LableLoadGoogleScript = function (afterLoad) {
            var map_key = "AIzaSyAZ2JC2JTuX5kibdbVQvaWH4BaNDab1PHk";
            return SPL.labelLoadScript("//maps.googleapis.com/maps/api/js?key=" + map_key + "&libraries=places", function () {
                return afterLoad();
            });
        }

        SPL.loadCss = function (url) {
            var head = document.getElementsByTagName('head')[0], // reference to document.head for appending/ removing link nodes
                link = document.createElement('link'); // create the link node
            link.setAttribute('href', url);
            link.setAttribute('rel', 'stylesheet');
            link.setAttribute('type', 'text/css');

            head.appendChild(link); // insert the link node into the DOM and start loading the style sheet

            return link; // return the link node;
        }

        SPL.updateSPLVariantId = function () { // before using this paste this wk_variant_selector in variant selector
            SPL.$('.wk_variant_selector ').on('change', function () {
                SPL.$(".wk_pay_what_you_want").css("visibility", "visible");
                SPL.$(".wk_error_message").css("visibility", "hidden");
                var ajax_url = SPL.$(location).attr("href");
                var ajax_arr = ajax_url.split("/");
                var ajax_handle = ajax_arr[ajax_arr.length - 1];
                var query_param = ajax_handle.split("?");
                if (query_param[1]) {
                    var ajax_variant = query_param[1].split("&").filter(v => v.trim().split("=")[0] === "variant");
                    SPL.main_id_variant = ajax_variant.length > 0 ? ajax_variant[0].split("=")[1] : 0;
                    console.log("spl variant id update to " + SPL.main_id_variant);
                }
            })
        }

        SPL.createDraftOrderOnCheckout = function (selected_tag) {


            SPL.$.get('/cart.js', function (cart_details) {


                if (cart_details) {

                    cart_arr = {};
                    SPL.$.each(cart_details.items, function (i, item) {
                        var arr = {};
                        arr['title'] = item.variant_title;
                        arr['quantity'] = item.quantity;
                        arr['product_id'] = item.product_id;
                        arr['variant_id'] = item.variant_id;
                        arr['price'] = item.price;
                        arr['handle'] = item.handle;
                        arr['vendor'] = item.vendor;
                        arr['product_title'] = item.product_title;
                        arr['properties'] = item.properties;
                        arr['key'] = item.key;
                        arr['requires_shipping'] = item.requires_shipping;
                        arr['grams'] = item.grams;
                        cart_arr[i] = arr;
                    });
                    let cart_attributes = {};
                    SPL.$("input[name*='attributes']").each((data, val) => {
                        let name = val.name;
                        name = name.substr(11, name.length - 12);
                        cart_attributes[name] = val.value;
                    });
                    let cart_note = cart_details.note;
                    var wk_preorder_count = SPL.$(".wk_po_count").length;

                    SPL.$.ajax({
                        url: SPL.api_url + "index.php?p=ajax_draft_order_process",
                        type: "POST",
                        crossDomain: true,
                        dataType: "json",
                        data: {
                            shop: Shopify.shop,
                            cart_details: cart_arr,
                            cart_token: cart_details.token,
                            selected_tag: selected_tag,
                            wk_insurance_selected: SPL.wk_insurance_selected,
                            wk_routes_insurance_price: SPL.wk_routes_insurance_price,
                            wk_preorder_count: wk_preorder_count,
                            customer_id: meta.page.customerId,
                            cart_attributes: cart_attributes,
                            cart_note: cart_note,
                            callback: "getDraftOrderInvoice"
                        },
                        success: function (data) {
                            if (data.invoice_url && data.invoice_url != "undefined" && data.invoice_url != "") {
                                console.log("draft order created");
                                //console.log(data);
                                window.location.href = data.invoice_url;
                                // window.location.reload();
                            } else if (data.error) {
                                if (SPL.$(".wk_po_msg__div").length) {
                                    SPL.$(".wk_po_msg__div").html("<p style='color:red;word-wrap:break-word;' id='wk-po-error-msg'>" + wk_preorder_qty_error_label + "</p>");
                                }
                            }
                            // else {

                            //     SPL.$("form.cart").submit();
                            // }

                        },
                        error: function (error) {
                            console.log(error);
                        },
                        complete: function () {
                            SPL.$('#wk_checkout_btn').removeAttr('disabled');
                        }
                    });
                }
            }, 'json');
        }

        SPL.createDraftOrderForSubscription = function(){
            SPL.main_id_product = SPL.$(".wk_subscription_product").attr("data-prod");
            SPL.main_id_variant = SPL.$(".wk_subscription_product").attr("data-var");
            SPL.quantity        = SPL.$(".wk_subscription_quantity").val();

            SPL.$.ajax({
                url: SPL.api_url + "index.php?p=ajax_draft_order_process",
                type: "POST",
                crossDomain: true,
                dataType: "json",
                data: {
                    shop: Shopify.shop,
                    main_id_product : SPL.main_id_product,
                    main_id_variant : SPL.main_id_variant,
                    quantity        : SPL.quantity ,
                    callback: "getDraftOrderInvoiceForSubscription"
                },
                success: function (data) {
                    if (data.invoice_url && data.invoice_url != "undefined" && data.invoice_url != "") {
                        console.log("draft order created");
                        //console.log(data);
                        window.location.href = data.invoice_url;
                        // window.location.reload();
                    } else if (data.error) {
                        if (SPL.$(".wk_po_msg__div").length) {
                            SPL.$(".wk_po_msg__div").html("<p style='color:red;word-wrap:break-word;' id='wk-po-error-msg'>" + wk_preorder_qty_error_label + "</p>");
                        }
                    }
                    // else {

                    //     SPL.$("form.cart").submit();
                    // }

                },
                error: function (error) {
                    console.log(error);
                },
                complete: function () {
                    SPL.$('#wk_checkout_btn').removeAttr('disabled');
                }
            });
        }

        SPL.convertUTCtimeIntoBrowserTimeString = function (time_str) {

            var time = new Date("2001-01-01 " + time_str + " UTC"); // random date 
            var hours = time.getHours();
            var min = time.getMinutes();
            var time = hours + ":" + min;


            return time;
        }

        SPL.getDayNtimeNumber = function () {

            var time = new Date();
            console.log(time);
            var day = time.getDay();
            if (day == 0) // for sunday it give value 
                day = 7;
            var h = time.getHours();
            var m = time.getMinutes();
            var time_str = h + ':' + m;
            return { "day": day, "time": time_str };
        }

        SPL.isTimeBetweenSlot = function (time, slot_start_time, slot_close_time) { //format "H:i" only

            time = time.split(":");
            var time_minutes = (+time[0]) * 60 + (+time[1]);

            slot_start_time = slot_start_time.split(":");
            var slot_start_time_minutes = (+slot_start_time[0]) * 60 + (+slot_start_time[1]);

            slot_close_time = slot_close_time.split(":");
            var slot_close_time_minutes = (+slot_close_time[0]) * 60 + (+slot_close_time[1]);
            var result = false;

            if (slot_start_time_minutes < slot_close_time_minutes) {
                if (time_minutes <= slot_close_time_minutes && time_minutes >= slot_start_time_minutes)
                    result = true;
                else
                    result = false;
            } else {
                if (time_minutes <= slot_close_time_minutes || time_minutes >= slot_start_time_minutes)
                    result = true;
                else
                    result = false;
            }
            return result;
        }

        SPL.sellerTimeSlot = function (active_all_seller_time_slot) {

            var dayNtimeValue = SPL.getDayNtimeNumber();
            var today_slots = {};
            var store_closed = false;
            for (var seller_id in active_all_seller_time_slot) {
                var store_closed = true;
                if (typeof (SPL.$('#active_status_' + seller_id)) != "undefined") {
                    SPL.$('#active_status_' + seller_id).addClass("seller_offline");
                }
                today_slots = active_all_seller_time_slot[seller_id][dayNtimeValue['day']];
                for (var slot in today_slots) {
                    if (today_slots[slot]['o'] != "" && today_slots[slot]['c'] != "") {
                        today_slots[slot]['o'] = SPL.convertUTCtimeIntoBrowserTimeString(today_slots[slot]['o']);
                        today_slots[slot]['c'] = SPL.convertUTCtimeIntoBrowserTimeString(today_slots[slot]['c']);

                        var is_seller_online = SPL.isTimeBetweenSlot(dayNtimeValue['time'], today_slots[slot]['o'], today_slots[slot]['c']);
                        if (is_seller_online) {
                            store_closed = false;
                            break;
                        }
                    }
                }
            }
            if (store_closed) {
                if (SPL.$(".wk_cart").length != 0)
                    SPL.$(".wk_cart").prop("disabled", true);

                if (SPL.$("#wk_cart_error").length > 0) {
                    SPL.$("#wk_cart_error").show().css("color", "red");
                }
            }
        }

        SPL.getShippingMethod = function () {

            SPL.main_id_product = SPL.$("#wk_postcode_wise_shipping").attr("data-productid");
            SPL.weight = SPL.$("#" + SPL.main_id_variant).attr('wk_weight');
            SPL.country_name = SPL.$("#wk_country_dd option:selected").html();
            SPL.id_state = SPL.$("#wk_state_dd option:selected").val();

            SPL.$.ajax({
                url: SPL.api_url + "index.php?p=ajax_postcode_wise_shipping",
                type: "POST",
                jsonpCallback: 'getShippingMethod',
                crossDomain: true,
                dataType: "jsonp",
                data: {
                    shop: SPL.shop_name,
                    wk_postcode: SPL.wk_postcode,
                    country_name: SPL.country_name,
                    id_state: SPL.id_state,
                    quantity: SPL.quantity,
                    main_id_product: SPL.main_id_product,
                    main_id_variant: SPL.main_id_variant,
                    wk_weight: SPL.weight,
                    callback: "getShippingMethod"
                },
                success: function (data) {
                    var ship_html = "<table id ='shipping_table'><strong><tr><th>No.</th><th>Shipping Name</th><th>Price</th></tr><strong>";

                    console.log(data);
                    if (data != undefined && data != false && data.shipping) {
                        var shipping_method = data.shipping;
                        var key = SPL.wk_postcode + "_" + SPL.main_id_variant + "_" + SPL.quantity;
                        sessionStorage.setItem(key, JSON.stringify(shipping_method));
                        SPL.$.each(shipping_method, function (key, value) {
                            ship_html += "<tr><td>" + (key + 1) + "</td><td>" + value.service_name + "</td><td>" + value.range_price + "</td></tr>";
                        });
                        ship_html += "</table>";
                        SPL.$("#shipping_table").remove();
                        SPL.$("#error_div").remove();
                        SPL.$("#wk_postcode_wise_shipping").append(ship_html);
                    } else {
                        if (data == "no_shipping_available") {
                            if (typeof (no_shipping_available) !== 'undefined')
                                data = (no_shipping_available != '' && no_shipping_available != null) ? no_shipping_available : 'No Shipping Method Is Available';
                            else
                                data = 'No Shipping Method Is Available';
                        } else if (data == "currently_no_shipping_available") {
                            if (typeof (currently_no_shipping_available) !== 'undefined')
                                data = (currently_no_shipping_available != '' && currently_no_shipping_available != null) ? currently_no_shipping_available : 'Currently No Shipping Method Is Available';
                            else
                                data = 'Currently No Shipping Method Is Available';
                        } else if (data == "shipping_not_active_for_postcode_zone") {
                            if (typeof (shipping_not_active_for_postcode_zone) !== 'undefined')
                                data = (shipping_not_active_for_postcode_zone != '' && shipping_not_active_for_postcode_zone != null) ? shipping_not_active_for_postcode_zone : 'Shipping Is not Active For The Postcode Zone';
                            else
                                data = 'Shipping Is not Active For The Postcode Zone';
                        } else if (data == "postcode_zone_not_active") {
                            if (typeof (postcode_zone_not_active) !== 'undefined')
                                data = (postcode_zone_not_active != '' && postcode_zone_not_active != null) ? postcode_zone_not_active : 'Postcode Zone Shipping Is Not Active';
                            else
                                data = 'Postcode Zone Shipping Is Not Active';
                        } else if (data == "postcode_disabled") {
                            if (typeof (postcode_disabled) !== 'undefined')
                                data = (postcode_disabled != '' && postcode_disabled != null) ? postcode_disabled : 'Postcode Code Zone Has Not Been Configured By The Merchant';
                            else
                                data = 'Postcode Code Zone Has Not Been Configured By The Merchant';
                        }

                        var error = "<div style='color:red;' id='error_div'>" + "*" + data + "</div>";
                        SPL.$("#error_div").remove();
                        SPL.$("#shipping_table").remove();
                        SPL.$("#wk_postcode_wise_shipping").append(error);

                    }
                },
                error: function (error) {
                    console.log(error);
                }
            });
        }

        SPL.submitContactUsForm = function (form) {
            var name = form.find("input[name='name']").val().trim();
            var email = form.find("input[name='email']").val().trim();
            var query = form.find("textarea[name='query']").val().trim();
            var main_id_product = form.find("input[name='main_id_product']").val();
            if (!main_id_product) {
                main_id_product = SPL.wk_main_id_product;
            }

            var email_reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            var script_reg = /(<([^>]+)>)/ig;
            var spin = SPL.$('#loader');

            query = encodeURIComponent(query);
            form.find('.mp-err').html('');
            form.siblings('.mp-success').hide();

            if (name.length < 1) {
                form.find('.mp-err').html('Enter your name.');
            } else if (!email_reg.test(email)) {
                form.find('.mp-err').html('Enter a valid email address');
            } else if (query.length < 1) {
                form.find('.mp-err').html('Write your query');
            } else if (script_reg.test(email) || script_reg.test(name) || script_reg.test(query)) {
                form.find('.mp-err').html('Script tags are not allowed');
            } else {
                SPL.$('#query-btn').attr('disabled', 'disabled');
                SPL.$.ajax({
                    url: SPL.api_url + 'index.php?p=ajax_seller_profile_tag',
                    async: true,
                    cache: false,
                    jsonpCallback: 'query',
                    contentType: 'application/json',
                    dataType: 'jsonp',
                    data: {
                        name: name,
                        shop: SPL.shop_name,
                        email: email,
                        seller: SPL.seller,
                        is_preview: SPL.preview,
                        request_arr: SPL.request_arr,
                        main_id_product: main_id_product,
                        query: query,
                    },
                    beforeSend: function () {
                        spin.show();
                    },
                    success: function (response_data) {
                        spin.hide();
                        if (response_data.data == 'script_error')
                            form.find('.mp-err').html('Script tags are not allowed.. please try again after some time.');
                        else if (response_data.data == 'sww')
                            form.find('.mp-err').html('something went wrong.. please try again after some time.');
                        else if (response_data.data == 'success') {
                            form.siblings('.mp-success').show();
                            form.slideUp(function () {
                                SPL.$(this).remove();
                            });
                        }
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        SPL.$('#query-btn').show();
                        console.log(xhr.status);
                        console.log(thrownError);
                    },
                    complete: function () { }
                });
            }
            return false;
        }

        SPL.setCustomerData = function () {

            if (SPL.hyperlocal_enable === true)
                SPL.$("#wk_store_pickup_div").find("#shipping_calculator_table").remove();
            var wk_customer_location = JSON.parse(window.localStorage.getItem('wk_customer_location'));
            console.log("wk_customer_location  " + wk_customer_location);
            var country_name = id_country = id_state = state_name = false;
            if (wk_customer_location) {
                var lat = wk_customer_location.lat;
                var lng = wk_customer_location.lng;
                var geocoder = new google.maps.Geocoder();
                var latlng = { lat: parseFloat(lat), lng: parseFloat(lng) };
                geocoder.geocode({ location: latlng }, function (results, status) {
                    if (status === "OK") {
                        var idx = 0; // key2
                        var key = Object.keys(results)[idx];
                        value = results[key];
                        var address_components = value.address_components;
                        SPL.$.each(address_components, function (key, value) {
                            if (value.types[0] === "administrative_area_level_1" && value.types[1] === "political")
                                SPL.state_name = value.long_name;
                            if (value.types[0] === "country" && value.types[1] === "political")
                                SPL.country_name = value.long_name;
                        });
                        // console.log("customer country_name " + SPL.country_name);
                        // console.log("customer state_name" + SPL.state_name);
                        SPL.getMultipleShippingMethod();
                    }
                });
            }
        }
        SPL.getMultipleShippingMethod = function () {
            var wk_customer_location = JSON.parse(window.localStorage.getItem('wk_customer_location'));
            var country_name = id_country = id_state = state_name = false;
            if (wk_customer_location) {

                SPL.show_local_shipping = 1; //customer belongs to radius where seller is shipping
                country_name = SPL.country_name;
                state_name = SPL.state_name;
            } else {
                id_country = SPL.$("#wk_country_dd option:selected").val();
                country_name = SPL.$("#wk_country_dd option:selected").html();
                id_state = SPL.$("#wk_state_dd option:selected").val();
            }
            SPL.quantity = SPL.$(".wk_qty_selector").val();
            SPL.weight = SPL.$("#" + SPL.main_id_variant).attr('wk_weight');

            SPL.$.ajax({
                url: SPL.api_url + "index.php?p=ajax_mp_multiple_shipping",
                type: "POST",
                jsonpCallback: 'getMultipleShippingMethod',
                crossDomain: true,
                dataType: "jsonp",
                data: {
                    shop: SPL.shop_name,
                    main_id_product: SPL.wk_main_id_product,
                    main_id_variant: SPL.main_id_variant,
                    id_country: id_country,
                    id_state: id_state,
                    country_name: country_name,
                    quantity: SPL.quantity,
                    weight: SPL.weight,
                    state_name: state_name,
                    callback: "getMultipleShippingMethod"
                },
                success: function (data) {
                    SPL.$("#wk_shipping_tr").remove();
                    SPL.$("#error_div").html("");
                    // console.log("from mp shipping " + data);
                    if (data != undefined && data != false && data.shipping) {
                        var shipping_method = false;
                        var shipping_charge_label = (data.label != '' && data.label != null) ? data.label.shipping_charge : 'Shipping Charges';
                        var currency = data.currency;
                        var show_local_and_global_shipping_on_product_page = data.show_local_and_global_shipping_on_product_page; //works only when hyperlocal is active
                        html = "";
                        if (SPL.hyperlocal_enable === true || SPL.wk_multiple_shipping_div) {
                            var local_shipping = data.shipping.local_shipping;
                            var global_shipping = data.shipping.global_shipping;
                            var html = "<table id=shipping_calculator_table>";
                            if (show_local_and_global_shipping_on_product_page == 1) {
                                if (local_shipping != '' && local_shipping != null && typeof local_shipping !== "undefined")
                                    shipping_method = Object.assign(local_shipping, global_shipping);
                                else
                                    shipping_method = global_shipping;
                                // console.log(JSON.stringify(shipping_method, null, 4));
                            } else if (local_shipping && SPL.show_local_shipping == 1) {
                                shipping_method = local_shipping;
                                shipping_charge_label = (data.label != '' && data.label != null) ? data.label.local_shipping_charge : 'Local Shipping Charge';

                            } else if (global_shipping) {
                                shipping_method = global_shipping;
                                shipping_charge_label = (data.label != '' && data.label != null) ? data.label.global_shipping_charge : 'Global Shipping Charge';
                                if (typeof hyperlocal_active != 'undefined' && hyperlocal_active == 1) {
                                    SPL.$(".wk_hyperlocal").attr('disabled', false);
                                    SPL.$('#wk_product_available').html();
                                    SPL.addToCartDisabled = false;
                                }
                            } else
                                shipping_method = data.shipping;
                        } else
                            shipping_method = data.shipping;
                        if (shipping_method != 'shipping_not_found') {
                            // var shipping_charge_label = (data.label != '' && data.label != null) ? data.label.shipping_charge : 'Shipping Charges';
                            // if (shipping_type != "Normal")
                            //     shipping_charge_label = shipping_type + " " + shipping_charge_label;
                            html += "<tr id='wk_shipping_tr'><td><label  class='mp-label-font' for='wk_shipping_dd'>" + shipping_charge_label + "<span style='color:red;'>*<span></label> </td><td><div id='wk_shipping_div'> <select id='multiple_shipping_select'>";
                            SPL.$.each(shipping_method, function (key, value) {
                                html += "<option value='" + key + "' data-value='" + value.shipping_name + " , " + value.cost + "' datepicker-value='" + value.customer_datepicker + "'>" + value.shipping_name + " , " + currency + "   " + value.cost + "</option>";
                            });
                            if (SPL.hyperlocal_enable === true || SPL.wk_multiple_shipping_div)
                                html += "</select></div></td></tr></table>";
                            else
                                html += "</select></div></td></tr>";

                        }
                        if (SPL.hyperlocal_enable === true)
                            SPL.$("#wk_store_pickup_div").append(html);
                        else if (SPL.wk_multiple_shipping_div)
                            SPL.$("#wk_multiple_shipping_div").append(html);
                        else
                            SPL.$("#shipping_calculator_table").append(html);
                        SPL.addShippingToProduct();
                    } else {
                        var no_shipping_available_label = (data.label != '' && data.label != null) ? (typeof (data.label.no_shipping_available) == "undefined" ? 'No shipping Available' : data.label.no_shipping_available) : 'No shipping available';
                        var error = "<tr id='wk_shipping_tr' style='color:red;'><td><label  class='mp-label-font' for='wk_shipping_dd'>" + no_shipping_available_label + "<span style='color:red;'>*<span></label> </td></tr>";
                        SPL.$("#shipping_calculator_table").append(error);
                    }
                },
                error: function (error) {
                    console.log(error);
                }
            });
        }
        SPL.getAllCountry = function () {
            setTimeout(function () {
                if (SPL.$('#wk_shipping_calculate').length) {
                    SPL.$('#wk_shipping_calculate').html("");

                    if (SPL.$('#wk_postcode_wise_shipping').length) {
                        SPL.$('#wk_postcode_wise_shipping').html("");
                        //SPL.$("#error_div").remove();
                    }


                    SPL.$("head").append('<style type="text/css">.mp-spinner{ width: 36px !important; height: 36px !important; border-width: 2px !important;	} .mp-loader { position: fixed; background: rgba(255, 255, 255, 0.6); top: 0; left: 0; bottom: 0; right: 0; z-index: 1100} .mp-loader .mp-spinner { width: 52px; height: 52px; border: 4px solid #cccccc; border-radius: 50%; animation: mp-spin 460ms infinite linear; -o-animation: mp-spin 460ms infinite linear; -ms-animation: mp-spin 460ms infinite linear; -webkit-animation: mp-spin 460ms infinite linear; -moz-animation: mp-spin 460ms infinite linear; border-color: #555555 #cccccc; position: absolute; left: 50%; top: 50%; margin-left: -26px; margin-top: -26px; } .mp-loader .title-text { position: absolute; text-align: center !important; top: 56%; width: 100%; } @keyframes mp-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } } @-o-keyframes mp-spin { from { -o-transform: rotate(0deg); } to { -o-transform: rotate(360deg); } } @-ms-keyframes mp-spin { from { -ms-transform: rotate(0deg); } to { -ms-transform: rotate(360deg); } } @-webkit-keyframes mp-spin { from { -webkit-transform: rotate(0deg); } to { -webkit-transform: rotate(360deg); } } @-moz-keyframes mp-spin { from { -moz-transform: rotate(0deg); } to { -moz-transform: rotate(360deg); } }.mp-absolute {	position: absolute;	}.mp-relative {	position: relative;	} .mp-label-font{text-align:left!important; font-size:16px!important; margin-bottom:10px 0!important;} .wk-margin-bottom{margin-bottom:10px;} #shipping_calculator_table tbody tr td {border:none!important;} #shipping_calculator_table{margin-bottom:10px; border:none!important;} #wk_shipping_div{margin:15px!important;}</style>');

                    SPL.$.ajax({
                        url: "" + SPL.api_url + "index.php?p=ajax_shipping_calculate_process",
                        type: "GET",
                        dataType: "json",
                        data: { shop: Shopify.shop, callback: 'getAllCountry' },
                        beforeSend: function () {
                            SPL.$(".mp-loader").show();
                        },
                        success: function (data) {
                            SPL.$(".mp-loader").hide();
                            if (data == "not_active")
                                console.log("not_active");
                            else {
                                var country_label = (data.label != '' && data.label != null) ? data.label.country : 'Country';
                                var html = "<table id='shipping_calculator_table'><tr><td><label class='mp-label-font' for='wk_country_dd'>" + country_label + "<span style='color:red;'>*<span></label></td><td><div id='wk_country_div'></div></td></tr><table><div id='wk_shipping_div'></div>";
                                SPL.$("#wk_shipping_calculate").append(html);
                                html = "";
                                html += "<div class='wk-margin-bottom' style='width : 100%'> <select name='wk_counrty' id='wk_country_dd' style='width : 100%'><option value='select' selected>Select</option>";
                                SPL.$.each(data.countries, function (i, value) {
                                    if (data.selected_countries.length) {
                                        if (SPL.$.inArray(value.id_country, data.selected_countries) !== -1)
                                            html += "<option value='" + value.id_country + "'>" + value.name + "</option>";
                                    } else
                                        html += "<option value='" + value.id_country + "'>" + value.name + "</option>";
                                });
                                html += "</select></div>";
                                SPL.$("#wk_shipping_calculate_div").css({ 'border': '2px solid', 'margin': '20px 0px', 'padding': '20px' });
                                SPL.$("#wk_country_div").append(html);
                            }
                        },
                        error: function (error) {
                            console.log(error);
                        }
                    });
                } else
                    console.log("div not found");
            }, 2000);
        };
        SPL.addShippingToProduct = function () {

            var is_store_pickup = SPL.$("#wk_store_pickup_div").find('input[type="radio"]:checked').val();
            var shipping_name = SPL.$("#multiple_shipping_select").children("option:selected").attr('data-value');
            var datepicker_value = SPL.$("#multiple_shipping_select").children("option:selected").attr('datepicker-value');
            SPL.$("#wk_shipping").val(shipping_name);
            if (datepicker_value != "undefined" && datepicker_value == 1) {
                SPL.$("#wk_shipping_date_div").show();
                SPL.$("#wk_bring_pick_up_calendar_message").hide();
                SPL.$("#wk_bring_delivery_calendar_message").show();
                if (typeof $ == "function")
                    $("#wk_shipping_date").datepicker({ dateFormat: "dd-mm-yy" });

            } else {
                SPL.$("#wk_shipping_date_div").hide();
                SPL.$("#wk_bring_delivery_calendar_message,#wk_bring_pick_up_calendar_message").hide();
                SPL.$("#wk_shipping_date").val('');
            }

            SPL.$("#multiple_shipping_select").on('change', function () {
                shipping_name = SPL.$("#multiple_shipping_select").children("option:selected").attr('data-value');
                datepicker_value = SPL.$("#multiple_shipping_select").children("option:selected").attr('datepicker-value');
                SPL.$("#wk_shipping").val(shipping_name);
                if (datepicker_value != "undefined" && datepicker_value == 1) {
                    SPL.$("#wk_shipping_date_div").show();
                    SPL.$("#wk_bring_pick_up_calendar_message").hide();
                    SPL.$("#wk_bring_delivery_calendar_message").show();
                    if (typeof $ == "function")
                        $("#wk_shipping_date").datepicker({ dateFormat: "dd-mm-yy" });
                } else {
                    SPL.$("#wk_shipping_date_div").hide();
                    SPL.$("#wk_bring_delivery_calendar_message,#wk_bring_pick_up_calendar_message").hide();
                    SPL.$("#wk_shipping_date").val('');
                }
            })

        }


        SPL.response_quote_api = function (data) {

            if (data.insurance_price != "undefined")
                SPL.wk_routes_insurance_price = data.insurance_price;

        }

        SPL.response_insured_changed = function (data) {

            var insurance_selected = data.insurance_selected;
            if (insurance_selected) {
                SPL.wk_routes_insurance_price = data.insurance_price;
                SPL.wk_insurance_selected = 1;
            } else {
                SPL.wk_routes_insurance_price = 0;
                SPL.wk_insurance_selected = 0;
            }
        }
        SPL.vendorAddress = function (vendor_name) {

            SPL.$.ajax({
                url: SPL.api_url + 'index.php?p=ajax_seller_profile_tag',
                async: true,
                cache: false,
                jsonpCallback: 'vendor_address',
                contentType: 'application/json',
                dataType: 'jsonp',
                data: {
                    shop: SPL.shop_name,
                    request_arr: SPL.request_arr,
                    main_id_product: SPL.wk_main_id_product,
                    vendor_name: vendor_name,
                },
                success: function (data) {
                    if (data != undefined && data != false && data.vendor_address) {
                        var vendor_address = data.vendor_address;
                        sessionStorage.setItem("wk_seller_address", JSON.stringify(vendor_address));
                        SPL.$(".wk_vendor_address").each(function () {
                            vendor_store = SPL.$(this).attr("data-vendor");
                            if (vendor_address[vendor_store] != undefined && vendor_address[vendor_store].country == 'United States') {
                                SPL.$(this).html("<i class='fas fa-map-marker-alt' style='font-size:18px'></i> <span class='city'> " + vendor_address[vendor_store].city + ",</span><span class='state'> " + vendor_address[vendor_store].state + ",</span> <span class='country'> " + vendor_address[vendor_store].country + "</span>");
                            } else if (vendor_address[vendor_store] != undefined) {
                                SPL.$(this).html("<i class='fas fa-map-marker-alt' style='font-size:18px'></i> <span class='city'> " + vendor_address[vendor_store].city + ",</span><span class='country'> " + vendor_address[vendor_store].country + "</span>");
                            }

                        });

                    }
                },
                error: function (error) {
                    console.log(error);
                }
            });
        }
        return SPL;
    })();

    SPL.SPLCallback = function (DATA) { };
    SPL.shop_name = Shopify.shop;
    SPL.url_obj = document.URL;
    if (SPL.url_obj.endsWith("/"))
        SPL.url_obj = SPL.url_obj.slice(0, -1);

    // SPL.url_obj = document.URL.split("/");
    SPL.url_obj = SPL.url_obj.split("/");
    SPL.page = SPL.url_obj[SPL.url_obj.length - 2];
    SPL.handle = SPL.url_obj[SPL.url_obj.length - 1];
    SPL.handle_pagination = SPL.handle.split('?');
    SPL.handle_without_pagination = SPL.handle_pagination[0];
    SPL.main_id_variant = 0;
    SPL.addToCartDisabled = false;
    SPL.query_param = SPL.handle.split("?");
    if (SPL.query_param[1]) {
        SPL.variant = SPL.query_param[1].split("&").filter(v => v.trim().split("=")[0] === "variant");
        SPL.main_id_variant = SPL.variant.length > 0 ? SPL.variant[0].split("=")[1] : 0;
    }

    // variable assigning
    if (typeof wk_label_store_name === "undefined")
        wk_label_store_name = "Seller Store Name";
    if (typeof wk_label_product_name === "undefined")
        wk_label_product_name = "Product Name";
    if (typeof wk_label_checkout_condition === "undefined")
        wk_label_checkout_condition = "Checkout Condition";
    if (typeof wk_label_pass === "undefined")
        wk_label_pass = "Pass";
    if (typeof wk_label_fail === "undefined")
        wk_label_fail = "Fail (amount";
    if (typeof wk_label_need_added === "undefined")
        wk_label_need_added = "needs to be added)";
    if (typeof wk_label_minimum_quantity === "undefined")
        wk_label_minimum_quantity = "Quantity Must be greater than Minimum purchase Quantity";
    if (typeof wk_label_minimum_purchase_amount === "undefined")
        wk_label_minimum_purchase_amount = "Minimum Purchase Amount";
    if (typeof (label_data) != "undefined" && label_data && label_data.label34) {
        wk_preorder_qty_error_label = label_data.label34;
    } else {
        wk_preorder_qty_error_label = "Product quantity available for preorder is less than the quantity added to the cart. Kindly, reduce the product quantity & proceed to checkout.";
    }
    if (SPL.page == 'products') {
        SPL.show_seller_info = 0;
        SPL.labelLoadjQuery(function () {
            SPL.request_arr = [];
            /**** valerie customization start ********/
            SPL.wk_main_id_product = Number(SPL.$(".wk_seller_detail").eq(0).attr('data-productid'));
            if (isNaN(SPL.wk_main_id_product) || SPL.wk_main_id_product == "" || SPL.wk_main_id_product == 0)
                SPL.wk_main_id_product = Number(SPL.$(".wk_seller_detail_logo").attr('data-productid'));
            if (isNaN(SPL.wk_main_id_product) || SPL.wk_main_id_product == "" || SPL.wk_main_id_product == 0)
                SPL.wk_main_id_product = Number(SPL.$(".wk_seller_store_logo").attr('data-productid'));
            if (isNaN(SPL.wk_main_id_product) || SPL.wk_main_id_product == "" || SPL.wk_main_id_product == 0)
                SPL.wk_main_id_product = Number(SPL.$(".wk_seller_detail_n_logo").attr('data-productid'));
            /**** valerie customization end ********/

            if (isNaN(SPL.wk_main_id_product) || SPL.wk_main_id_product == "" || SPL.wk_main_id_product == 0)
                SPL.wk_main_id_product = Number(SPL.$(".wk_seller_info").attr('data-productid'));
            if (isNaN(SPL.wk_main_id_product) || SPL.wk_main_id_product == "" || SPL.wk_main_id_product == 0)
                SPL.wk_main_id_product = Number(SPL.$('#seller-policy-tab').data('productid'));

            if (isNaN(SPL.wk_main_id_product) || SPL.wk_main_id_product == "" || SPL.wk_main_id_product == 0)
                SPL.wk_main_id_product = Number(SPL.$('#wk_delivery_day_div').data('productid'));


            if (SPL.$('#wk_store_pickup_div').length) {
                if (isNaN(SPL.wk_main_id_product) || SPL.wk_main_id_product == "" || SPL.wk_main_id_product == 0)
                    SPL.wk_main_id_product = Number(SPL.$('#wk_store_pickup_div').attr('data-productid'));
                SPL.request_arr.push('hasStorePickupDiv');
            }
            if (SPL.$('#wk_seller_badge_div').length || SPL.$('.wk_seller_badge_div').length) {
                if (isNaN(SPL.wk_main_id_product) || SPL.wk_main_id_product == "" || SPL.wk_main_id_product == 0)
                    SPL.wk_main_id_product = Number(SPL.$('#wk_seller_badge_div').attr('data-productid'));
                if (isNaN(SPL.wk_main_id_product) || SPL.wk_main_id_product == "" || SPL.wk_main_id_product == 0)
                    SPL.wk_main_id_product = Number(SPL.$('.wk_seller_badge_div').attr('data-productid'));
                SPL.request_arr.push('getSellerBadge');
            }

            if (SPL.$("#wk_seller_vacation_div").length == 1) {
                if (isNaN(SPL.wk_main_id_product) || SPL.wk_main_id_product == "" || SPL.wk_main_id_product == 0)
                    SPL.wk_main_id_product = Number(SPL.$('#wk_seller_vacation_div').attr('data-productid'));
                SPL.request_arr.push('hasSellerVacationDiv');
            }
            if (isNaN(SPL.wk_main_id_product) || SPL.wk_main_id_product == "" || SPL.wk_main_id_product == 0)
                SPL.wk_main_id_product = Number(SPL.$("#wk_seller_description").attr('data-productid'));

            if (isNaN(SPL.wk_main_id_product) || SPL.wk_main_id_product == "" || SPL.wk_main_id_product == 0)
                SPL.wk_main_id_product = Number(SPL.$("#wk_shipping_zones").attr('data-productid'));
            if (isNaN(SPL.wk_main_id_product) || SPL.wk_main_id_product == "" || SPL.wk_main_id_product == 0)
                SPL.wk_main_id_product = Number(SPL.$(".wk_seller_custom_detail").attr('data-productid'));
            if (isNaN(SPL.wk_main_id_product) || SPL.wk_main_id_product == "" || SPL.wk_main_id_product == 0)
                SPL.wk_main_id_product = Number(SPL.$(".wk_product_custom_detail").attr('data-productid'));
            if (isNaN(SPL.wk_main_id_product) || SPL.wk_main_id_product == "" || SPL.wk_main_id_product == 0)
                SPL.wk_main_id_product = Number(SPL.$(".wk_hyperlocal_mp").attr('data-productid'));
            if (isNaN(SPL.wk_main_id_product) || SPL.wk_main_id_product == "" || SPL.wk_main_id_product == 0)
                SPL.wk_main_id_product = Number(SPL.$("#min_purchase_quantity_div").attr('data-productid'));
            if (isNaN(SPL.wk_main_id_product) || SPL.wk_main_id_product == "" || SPL.wk_main_id_product == 0)
                SPL.wk_main_id_product = Number(SPL.$(".wk_product_custom_file_type").attr('data-productid'));

            if (isNaN(SPL.main_id_variant) || SPL.main_id_variant == "" || SPL.main_id_variant == 0) {
                if (SPL.$('form[action="/cart/add"]').length > 1)
                    SPL.main_id_variant = SPL.$('input[name^=id]:checked, select[name^=id], input[name=id], hidden[name^=id]', SPL.$('.wk_hyperlocal_product_variant')).val();
                else
                    SPL.main_id_variant = SPL.$('input[name^=id]:checked, select[name^=id], input[name=id], hidden[name^=id]', SPL.$('form[action="/cart/add"]')).val();
            }

            if (SPL.$(".wk_seller_info").length)
                SPL.show_seller_info = 1;

            if (SPL.$(".wk_seller_detail").length || SPL.$(".wk_seller_detail_logo").length || SPL.$(".wk_seller_store_logo").length || SPL.$(".wk_seller_info").length) {

                // SPL.appendDiv();
				console.log('exists');
                SPL.request_arr.push('sellProfileCallback')
            }

            if (SPL.shop_name != "oliverprestige.myshopify.com" && (SPL.$(".wk_product_custom_detail").length || SPL.$(".wk_seller_custom_detail").length || SPL.$(".wk_product_custom_file_type").length)) {
                // SPL.getCutomeFieldDetail();
                SPL.request_arr.push("CutomeFieldDetailCallback");
            }
            if (SPL.$('#seller-policy-tab').length > 0) {
                // SPL.getSellerPolicy(product);
                SPL.request_arr.push("getreviews");
            }
            if (SPL.$('#wk_delivery_day_div').length > 0) {
                // SPL.getDeliveryDay(product);
                SPL.request_arr.push("getdeliveryday");
            }

            if (SPL.$('#wk_seller_description').length > 0) {
                // SPL.getSellerPolicy(product);
                SPL.request_arr.push("geSellerDescription");
            }

            if (SPL.$('#wk_seller_description').length > 0) {
                // SPL.getSellerPolicy(product);
                SPL.request_arr.push("geSellerDescription");
            }
            if (SPL.$('#wk_shipping_zones').length > 0) {
                SPL.request_arr.push('getSellerShippingZones');
            }
            if (SPL.$('.wk_hyperlocal_mp').length > 0 && typeof hyperlocal_active != "undefined" && hyperlocal_active == 1) {
                SPL.storedIds = JSON.parse(localStorage.getItem("wk_seller_ids"));
                SPL.custm_loc = JSON.parse(localStorage.getItem("wk_customer_location"));

                SPL.request_arr.push('getSellerAvailablity');
            } else if (typeof hyperlocal_active != "undefined" && hyperlocal_active == 0) {
                localStorage.removeItem('wk_customer_location');
                localStorage.removeItem('wk_seller_ids');
            }
            if (SPL.$('#wk-slot-var-price').length == 0 || SPL.$('#wk_store_pickup_div').length > 0) {
                if (SPL.$('#wk-slot-var-price').length == 0)
                    SPL.request_arr.push('getMinPurchaseQuantity');
                if (SPL.$('.single-option-selector ').length) {
                    SPL.$('.single-option-selector ').on('change', function () {
                        var ajax_url = SPL.$(location).attr("href");
                        var ajax_arr = ajax_url.split("/");
                        var ajax_handle = ajax_arr[ajax_arr.length - 1];
                        var query_param = ajax_handle.split("?");
                        if (query_param[1]) {
                            var ajax_variant = query_param[1].split("&").filter(v => v.trim().split("=")[0] === "variant");
                            SPL.main_id_variant = ajax_variant.length > 0 ? ajax_variant[0].split("=")[1] : 0;
                        }
                        SPL.request_arr = Array();
                        if (SPL.$('#wk-slot-var-price').length == 0)
                            SPL.request_arr.push('getMinPurchaseQuantity');
                        if (SPL.$('#wk_store_pickup_div').length > 0)
                            SPL.request_arr.push('hasStorePickupDiv');
                        //SPL.getAllConfigDetails();
                    })
                }
            }



            if (SPL.$('.wk_qty_selector_value').length) {
                SPL.request_arr.push('getMinPurchaseQuantity');
            }

            // minimum purchase amount
            if (SPL.$("#wk_product_mpa").length) {
                SPL.wk_main_id_product = Number(SPL.$("#wk_product_mpa").attr("data-product_id"));
                SPL.wk_selected_tag = SPL.$("#wk_product_mpa").attr("data-selected_tag");
                SPL.request_arr.push('getSellerMinPurchaseAmount');
            }
            if (SPL.$(".wk_choice_pay").length) {
                SPL.request_arr.push('getPayWhatYouWantStatus');
            }

            if (SPL.$("#wk_seller_time_slot").length) {
                SPL.wk_main_id_product = SPL.$("#wk_seller_time_slot").attr("data-productid");
                SPL.request_arr.push('getSellerTimeSlot');
            }

            if (SPL.$("#wk_postcode_wise_shipping").length) {
                SPL.wk_main_id_product = SPL.$("#wk_postcode_wise_shipping").attr("data-productid");
                SPL.request_arr.push('getPostcodeWiseShipping');
            }

            if (SPL.$("#wk_multiple_shipping_div").length) {
                SPL.wk_main_id_product = SPL.$("#wk_multiple_shipping_div").attr("data-productid");
                SPL.request_arr.push('getMultipleShippingOnProductPage');
            }


            if (SPL.$("#seller_country_origin_div").length) {
                SPL.wk_main_id_product = SPL.$("#seller_country_origin_div").attr("data-productid");
                SPL.request_arr.push('AllowCountrOriginOnProduct');
            }


            if (SPL.request_arr.length > 0) {
                /* need to get all configuration data from ajax */
                SPL.getAllConfigDetails();
            }
            if (SPL.$('#contact-us-form').length) {
                SPL.$('body').on('submit', '#contact-us-form', function (e) {
                    e.preventDefault();
                    SPL.request_arr = [];
                    SPL.request_arr.push('query');
                    SPL.submitContactUsForm(SPL.$(this));
                });
            }


            var wk_subscription = SPL.$("body").find(".wk_subscription_checkout_btn").length;
            //console.log("tushar jain testing5 " + wk_subscription);
            if(wk_subscription > 0){
                SPL.$("body").on("click", "#wk_checkout_btn", function (e) {
                    SPL.$(this).attr('disabled', 'disabled');
                    e.preventDefault();
                    //console.log("tushar jain testing5 ");
                    var radioValue = SPL.$("input[name='properties[subscription_want]']:checked").val();
                    console.log("testing radir value"+radioValue);
                    if(radioValue == "SUBSCRIPTION"){
                        SPL.createDraftOrderForSubscription();
                    }
                    //
                })

            }

            SPL.$('body').on('change', '#wk_country_dd', function () {
                if (SPL.$('#wk_postcode_wise_shipping').length) {
                    SPL.$('#wk_postcode_wise_shipping').html("");
                }
                SPL.$('#wk_state_tr ,#wk_calculate_tr,#wk_shipping_tr,#wk_postcode_tr,#shipping_table,#wk_postcode_div').html("");
                SPL.$("#wk_shipping").val('');
                SPL.$("#wk_shipping_date").val('');
                var id_country = SPL.$("#wk_country_dd option:selected").val();
                // console.log("selected country " + id_country);
                if (id_country != "") {
                    SPL.$.ajax({
                        url: "" + SPL.api_url + "index.php?p=ajax_shipping_calculate_process",
                        type: "GET",
                        dataType: "json",
                        data: { shop: Shopify.shop, id_country: id_country, callback: 'getActiveStates' },
                        success: function (data) {
                            if (data == "not_active")
                                console.log("not_active");
                            else {
                                var state_label = (data.label != '' && data.label != null) ? data.label.state : 'State';
                                var calculate_label = (data.label != '' && data.label != null) ? data.label.calculate : 'Calculate';
                                var zipcode_label = (data.label != '' && data.label != null) ? data.label.zipcode : 'Zipcode';
                                SPL.$("#wk_state_div, #wk_postcode_div").html("");
                                html = "";
                                if (data.states != 'state_not_found') {
                                    html += "<tr id='wk_state_tr'><td><label  class='mp-label-font' for='wk_state_dd'>" + state_label + "<span style='color:red;'>*<span></label> </td><td><div id='wk_state_div'><select name='wk_state' id='wk_state_dd' class='wk-margin-bottom' style='width : 100%'>";
                                    SPL.$.each(data.states, function (i, value) {
                                        html += "<option value='" + value.id + "'>" + value.name + "</option>";
                                    });
                                    html += "</select></div></td></tr>";
                                }

                                if (SPL.enable_country_in_postcode == 1) {
                                    html += "<tr id='wk_postcode_tr'><td><label  class='mp-label-font' for='wk_postcode'>" + zipcode_label + " <span style='color:red;'>*<span></label></td><td><div id='wk_postcode_div'><input required style='width : 100%' type='text' id='wk_postcode' name='wk_postcode'><span style='color:red; margin:10px;' id='wk_shipping_calculate_error'></span></div></td></tr><tr id='wk_calculate_tr'><td collspan='2'><div><button id='wk_postcode_country_shipping' class='btn btn-outline-secondary'>" + calculate_label + "</button></div></td></tr>";
                                } else {
                                    html += "<tr id='wk_calculate_tr'><td collspan='4'><div><input id='wk_shipping_calculate_btn' style='margin-top:15px; display:block;' class='btn' type='button' value='" + calculate_label + "'></div></td></tr>";
                                }

                                SPL.$("#shipping_calculator_table").append(html);
                            }
                        },
                        error: function (error) {
                            console.log(error);
                        }
                    });
                }
            });

            SPL.$('body').on('click', '#wk_shipping_calculate_btn', function () {
                SPL.$('#wk_shipping_calculate_error').html("");
                SPL.$('#wk_shipping_div').html("");
                SPL.getMultipleShippingMethod();

            });
            SPL.$('body').on('click', '#wk_postcode_country_shipping', function () {

                var error = "";
                SPL.wk_postcode = SPL.$("#wk_postcode").val();


                if (!SPL.wk_postcode.trim()) {
                    if (typeof (postcode_required) !== 'undefined')
                        postcode_required = (postcode_required != '' && postcode_required != null) ? postcode_required : 'Postalcode is required';
                    else
                        var postcode_required = 'Postalcode is required';

                    error += "<div id='error_div' style='color:red;'>" + postcode_required + "</div>";
                    SPL.$("#wk_postcode_wise_shipping").html("");
                    SPL.$("#wk_postcode_wise_shipping").append(error);
                } else if (typeof SPL.wk_postcode != "undefined" && SPL.wk_postcode != "") {
                    SPL.quantity = SPL.$(".wk_qty_selector").val();

                    var key = SPL.wk_postcode + "_" + SPL.main_id_variant + "_" + SPL.quantity;
                    var shipping_method = JSON.parse(sessionStorage.getItem(key));

                    if (!shipping_method)
                        SPL.getShippingMethod();
                    else {

                        var ship_html = "<table id ='shipping_table'><strong><tr><th>No.</th><th>Shipping Name</th><th>Price</th></tr><strong>";
                        SPL.$.each(shipping_method, function (key, value) {
                            ship_html += "<tr><td>" + (key + 1) + "</td><td>" + value.service_name + "</td><td>" + value.range_price + "</td></tr>";

                        });
                        ship_html += "</table>";
                        SPL.$("#shipping_table").remove();
                        SPL.$("#error_div").remove();
                        SPL.$("#wk_postcode_wise_shipping").append(ship_html);
                    }
                }

            });


            SPL.$('body').on('change', '#wk_state_dd', function () {
                if (SPL.enable_country_in_postcode == 1) {
                    SPL.$("#wk_postcode").val('');
                    SPL.$("#wk_postcode_wise_shipping").html("");
                }
            });


        });
    } else if (SPL.handle_without_pagination == 'cart') {
        //console.log("tushar jain testing1 ");
        SPL.labelLoadjQuery(function () {
            var check_minimum_purchase_condition = (SPL.$("body").find(".wk_make_offer_count").length == 0 && SPL.$("body").find(".wk_slot_count").length == 0);
            if (check_minimum_purchase_condition) {
                if (SPL.$("body").find(".wk_pay_what_you_want_count").length)
                    SPL.pay_what_you_want = true;
                SPL.checkMinimumPurchase(checkoutButtonCallback);
            }
            else
                checkoutButtonCallback();
            //console.log("tushar jain testing2 ");
            
        });

    } else if (SPL.handle_without_pagination == 'login' || SPL.handle_without_pagination == 'activate-your-account') {
        SPL.labelLoadjQuery(function () {
            SPL.$("#customer_email").focusin(function () {

                SPL.$(this).removeClass('input--error');
            });
            SPL.$('body').on('submit', '#customer_active_from', function (e) {
                e.preventDefault();
                var email_id = SPL.$('#wk_customer_email').val();
                if (email_id == '') {
                    SPL.$('#wk_customer_email').addClass('error');
                } else {
                    SPL.activeCustomerInfo(email_id)
                }
                return false;
            })
        });
    } else if (SPL.url_obj[SPL.url_obj.length - 3] == 'account' && SPL.url_obj[SPL.url_obj.length - 2] == 'orders') {
        SPL.labelLoadjQuery(function () {
            if (SPL.$("#storepickup_direction").length) {
                SPL.$("body").on("click", "#storepickup_direction", function () {
                    var pickup_address = SPL.$(this).attr("title");
                    if (typeof pickup_address != "undefined" && pickup_address != "") {
                        window.open("https://maps.google.com/?q=" + pickup_address);
                    }
                });
                SPL.$("#storepickup_direction").css("cursor", "pointer");
            } else {
                SPL.$("body").find("img").on("click", function () {
                    var pickup_address = SPL.$(this).attr("title");
                    if (typeof pickup_address != "undefined" && pickup_address != "") {
                        window.open("https://maps.google.com/?q=" + pickup_address);
                    }
                });
                SPL.$("img").css("cursor", "pointer");
            }


        });

    } else if (SPL.page == 'collections' || SPL.page == "" || SPL.handle_without_pagination == 'search') {
        SPL.labelLoadjQuery(function () {
            if (SPL.$('.wk_hyperlocal_mp').length > 0 && typeof hyperlocal_active != "undefined" && hyperlocal_active) {
                SPL.storedIds = JSON.parse(localStorage.getItem("wk_seller_ids"));
                SPL.sellerStores = JSON.parse(localStorage.getItem("wk_seller_stores"));
                var val;
                SPL.$('.wk_hyperlocal_vendor').each(function (val) {
                    val = SPL.$(this).attr('data-value');
                    if (SPL.$.inArray(val, SPL.sellerStores) == -1) {
                        SPL.$(this).html('<b>' + product_unavailable + '<b>');
                    }
                });
            }
            if (SPL.$('.wk_vendor_address').length > 0) {
                SPL.$("head").append("<script src='https://kit.fontawesome.com/a076d05399.js'></script>");
                SPL.sellerAddress = JSON.parse(sessionStorage.getItem("wk_seller_address"));
                var vendor_in_session = [];
                var vendor_name = [];
                SPL.$('.wk_vendor_address').each(function (val) {
                    val = SPL.$(this).attr('data-vendor');
                    if (SPL.sellerAddress != undefined && SPL.sellerAddress != false) {
                        if (val in SPL.sellerAddress) {
                            vendor_in_session.push(val);
                        }
                    } else {
                        vendor_name.push(val);
                    }
                });
                if (vendor_in_session != undefined && vendor_in_session != false) {
                    SPL.$(".wk_vendor_address").each(function () {
                        vendor_store = SPL.$(this).attr("data-vendor");
                        if (SPL.sellerAddress[vendor_store] != undefined && SPL.sellerAddress[vendor_store].country == 'United States') {
                            SPL.$(this).html("<i class='fas fa-map-marker-alt' style='font-size:18px'></i> <span class='city'> " + SPL.sellerAddress[vendor_store].city + ", </span><span class='state'> " + SPL.sellerAddress[vendor_store].state + ", </span><span class='country'> " + SPL.sellerAddress[vendor_store].country + "</span>");
                        } else if (SPL.sellerAddress[vendor_store] != undefined) {
                            SPL.$(this).html("<i class='fas fa-map-marker-alt' style='font-size:18px'></i> <span class='city'> " + SPL.sellerAddress[vendor_store].city + ", </span><span class='country'> " + SPL.sellerAddress[vendor_store].country + "</span>");
                        }
                    });
                }
                if (vendor_name != undefined && vendor_name != false) {
                    SPL.request_arr.push('vendor_address');
                    SPL.vendorAddress(vendor_name);
                }

                
            }
        });
    } else if (SPL.handle_without_pagination == 'account') {

        SPL.labelLoadjQuery(function () {
            SPL.customer_email = SPL.$("#wk_draft_order_div").attr('data-customerEmail');
            SPL.getCustomerData();
        })
    } 
}).call(this);

function checkoutButtonCallback()
{
    if (SPL.$("button.wk-buy").length == 0) {
        var checkout_button = SPL.$("input[name='checkout']");
        var wk_slot_count = SPL.$("body").find(".wk_slot_count").length;
        var wk_pay_what_you_want_count = SPL.$("body").find(".wk_pay_what_you_want_count").length;
        var wk_add_on_count = SPL.$("body").find(".wk_addon_count").length;
        var insurance_on = SPL.$("body").find("#RouteWidget").length;
        var customerid = meta.page.customerId;
        let wk_po_count = SPL.$(".wk_po_count").length;
       // var wk_subscription_product = true;
        if (checkout_button.length == 0)
            checkout_button = SPL.$("button[name='checkout']");

        if(checkout_button.length == 0)
            checkout_button = SPL.$("a[name='checkout'].wk_checkout_btn");

        if (checkout_button.length && (wk_slot_count || wk_pay_what_you_want_count || wk_add_on_count || insurance_on || wk_po_count)) {
           // console.log("tushar jain testing4 ");
            var selected_tag = "";
            var selected_tag_dom = SPL.$("body").find("[data-wk_slot_subtotal='wk_slot']");
            if (selected_tag_dom.length)
                selected_tag = selected_tag_dom.attr("data-wk_selected_tag");

            if(SPL.$('.wk_checkout_btn').length > 0)
            {
                SPL.$("body").on("click", '.wk_checkout_btn', function (e) {
                    if (SPL.shop_name == "cerqular.myshopify.com") {
                        if (wk_error_cart_p_limit_msg == 'undefined') {
                            var wk_error_cart_p_limit_msg = '<p style="color:red;font-size:12px;" class="wk-cart-error-msg">Something Went Wrong</p>';
                        }
                        var cart_limit_exceed = false;
                        // check checkout form is vaild
                        $('.wk_cart_validated_prod_limit').each(function () {
                            if ($(this).find('input').val() > 1) {
                                cart_limit_exceed = true;
                                if (cart_limit_exceed) {
                                    return false;
                                }
                            }
                        });
                        if (cart_limit_exceed) {
                            if ($(this).prev('.wk-cart-error-msg').length == 0) {
                                $(this).before(wk_error_cart_p_limit_msg);
                            }
                            return false;
                        }
                    }
                    if (wk_po_count) {
                        let coming_url = document.location.href;
                        let redirecturl = "/account/login?checkout_url=" + coming_url + "#wkpreorder";

                        if (typeof (customerid) == "undefined") {
                            window.open(redirecturl, '_top');
                            return false;
                        }
                    }
                    SPL.$(this).attr('disabled', 'disabled');
                    e.preventDefault();
                    SPL.createDraftOrderOnCheckout(selected_tag);
                })
            }
        }
    }
    if (SPL.$("#RouteWidget").length != 0) {
        console.log("RoutesWidget found");
        routeapp.on_insured_change(SPL.response_insured_changed);
    }
}

function minPurchaseQuantityFuntion(data, cart_arr, split_cart_feature, vendor_wise_prod, checkout_btn, vendor_name, moq_level, prod_wise_qty) {

    SPL.$.each(data, function (id, qty) {
        // var slot_prod_id = "qty_" + id;
        var id_prefix = "updates_large_";
        if (split_cart_feature)
            id_prefix = "updates_";
        var update_id = id_prefix + id;
        var is_slot_product = false;

        if (SPL.$("[id='" + update_id + "']").length == 0) {
            update_id = id_prefix + cart_arr[id].key;
            if (SPL.$("[id='" + update_id + "']").length == 0) {
                if (SPL.$("*[data-wk_min_qty_" + id + "]").length)
                    update_id = SPL.$("*[data-wk_min_qty_" + id + "]").attr("id");
            }
        }

        if (SPL.$("[id='" + update_id + "']").length) {
            // is_slot_product = document.getElementById(update_id).parentElement.getAttribute('id');

            // if (!is_slot_product) {
            var quantity_level = cart_arr[id].quantity;
            console.log("product id" + quantity_level);
            if (moq_level == 2) {
                quantity_level = prod_wise_qty[cart_arr[id].product_id];
            } else {
                document.getElementById(update_id).setAttribute('min', qty);
            }
            if (quantity_level < qty) {
                error = true;
                document.getElementById(update_id).style.color = "red";
                document.getElementById(update_id).style.backgroundColor = "#ecb9b9";
                if (!split_cart_feature) {
                    if (SPL.$("#wk_min_qty_error").length == 0) {
                        // SPL.$("input[name='checkout']").show();
                        // checkout button code to be added
                        SPL.minimum_quantity_status = false;
                        if (typeof (SLOT_P) === "undefined") { } else { SLOT_P.main_checkout_condition = false; }
                        SPL.main_checkout_condition = false;
                        if (SPL.$(".wk-minimum").length != 0) {
                            SPL.$(".wk-minimum").parent().append("<p id='wk_min_qty_error' style='color:red'> " + wk_label_minimum_quantity + "</p>");
                            SPL.$(".wk-minimum").hide();
                        } else {
                            checkout_btn.parent().append("<p id='wk_min_qty_error' style='color:red'> " + wk_label_minimum_quantity + "</p>");
                        }
                        if (checkout_btn.css('display') != "none") {
                            checkout_btn.hide();
                            SPL.$(".wk-additional-checkout-btn").css("display", "none");
                        }
                    }
                } else {
                    console.log("splitcart");
                    SPL.$.each(vendor_wise_prod, function (index, value) {
                        if (vendor_wise_prod[index].indexOf(id) != -1) {
                            if (SPL.$("#wk_min_qty_error" + index).length == 0) {
                                // checkout_btn.eq(index).hide();
                                checkout_btn.eq(index).parent().after("<p id='wk_min_qty_error" + index + "' style='color:red'> " + wk_label_minimum_quantity + "</p>");

                                var index = vendor_name.indexOf(checkout_btn.eq(index).attr('data-vendor'));
                                if (index != -1)
                                    vendor_name.splice(index, 1);
                                if (checkout_btn.eq(index).css('display') != "none") {
                                    checkout_btn.eq(index).hide();
                                    SPL.$(".wk-additional-checkout-btn").css("display", "none");
                                }
                            }
                        }
                    })
                }
            }
            // }
        }
    });

    return vendor_name;
}

function splitCartVendorShow(vendor_name) {
    SPL.$.each(vendor_name, function (key, seller) {
        SPL.$('button.wk-buy[data-vendor="' + seller + '"]').css("display", "inline-block");
    });
}

function validatePreorerQuantity(preorder_details, vendor_wise_prod, vendor_name, checkout_btn, split_cart_feature, key_arr, currency) {
    SPL.$.each(preorder_details, function (var_id, item) {
        // console.log("id: " + var_id);
        // console.log("error: " + item);
        if (item.error == 'no_qty_left') {
            if (split_cart_feature) {
                SPL.$.each(vendor_wise_prod, function (index, value) {
                    if (vendor_wise_prod[index].indexOf(var_id) != -1) {
                        var vendor_index = vendor_name.indexOf(checkout_btn.eq(index).attr('data-vendor'));
                        if (vendor_index != -1)
                            vendor_name.splice(vendor_index, 1);
                        if (checkout_btn.eq(index).css('display') != "none")
                            checkout_btn.eq(index).hide();
                        let preorder_error_div = SPL.$("<div class='wk_po_msg__div'><p style='color:red; word-wrap:break-word;' >" + wk_preorder_qty_error_label + "</p></div>");
                        checkout_btn.eq(index).parent("a").after(preorder_error_div);
                    }
                })
            } else {
                SPL.main_checkout_condition = false;
                SPL.$(".wk_po_msg__div").html("<p style='color:red; word-wrap:break-word;' id='wk-po-error-msg'>" + wk_preorder_qty_error_label + "</p>");
            }
        } else {
            // if ($("*[id='wk_price_" + key_arr[var_id]['key'] + "']").length)
            //     $("*[id='wk_price_" + key_arr[var_id]['key'] + "']").html(currency + " " + price);

            // if ($("*[id='wk_total_price_" + key_arr[var_id]['key'] + "']").length)
            //     $("*[id='wk_total_price_" + key_arr[var_id]['key'] + "']").html(currency + " " + total_price);
        }
    });
    // if ($("*[id='wk_subtotal_price']").length)
    //     $("*[id='wk_subtotal_price']").html(currency + " " + sub_total);
}



setInterval(function () { sessionStorage.clear(); }, 30 * 60 * 1000); //after each 30 min expire session storage
