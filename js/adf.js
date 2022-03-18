/*

Advanced Donation Form (Blackbaud Checkout)
====================================================================
Client: BBIS Sandbox
Author(s): Mark Hillard
Product(s): BBIS
Created: 03/16/2020
Updated: 03/16/2020


CHANGELOG
====================================================================
03/16/2020: Initial build
12/09/2019: Updated GUIDs for the MasterConfig Environment (kh)
*/


var ADF = ADF || {
    Defaults: {
        // api
        rootPath: BLACKBAUD.api.pageInformation.rootPath,
        pageId: BLACKBAUD.api.pageInformation.pageId,
        pageName: $.trim($(document).find('title').text()),
        partId: $('.BBDonationApiContainer').data('partid'),

        // designation query
        designationQuery: '612a82e8-24c8-4ae1-9aee-d5a006750507',
        // '612a82e8-24c8-4ae1-9aee-d5a006750507',

        // custom attributes
        comments: 'e3fe7cf0-7ffd-447a-979d-e73467ef94d6',
        matchingGift: '6840aed0-b85c-41c0-bb06-35df318abf0f',
        matchingGiftCompanyName: 'cce2f315-6ba7-4713-891b-5b2c4b422cc6',
        // solicitorCode: '268362bb-fe0c-49b3-a1f3-b5406b43f8a5',

        // code tables
        titleTable: '456ffd4c-0fbf-49db-a503-0726f86e2a39',
        defaultCountry: '4fc81243-c3ac-4ad8-be11-721be5795482',

        // server date
        serverDate: new Date($('.BBDonationApiContainer').attr('serveryear'), $('.BBDonationApiContainer').attr('servermonth') - 1, $('.BBDonationApiContainer').attr('serverday')),

        // keys
        publicKey: '',
        hepKey: 'c158149ee05a1',

        // merchant account
        MerchantAccountId: "864426b2-20a0-43aa-95f6-c850d757b026",

        // checkout overlay
        // opened: false,
        editorContent: '',
        checkoutError: '',
        // checkoutError: 'There was an error while performing the operation. The page will be refreshed.',

        // order id
        orderId: '',

        // Faculty/Staff donation fields
        // update on Production site
        payrollDeductionFrequency: '127d8c00-a909-4f1d-af58-377c66bfb151',
        // doNotStartUntilExistingCompleted: '7cc6bd0e-3a14-4f98-89f2-1c07c1a938b7',
        payrollDeductionMNumber: '98671854-a982-4446-b15c-6e9cb669f590',
        payrollDeductionStartDate: 'e9ffcc2f-01fe-4ce8-bfb7-48455c8045cb',
        payrollDeductionEndDate: '1edeff6b-ffa3-41be-82c4-d1af48aed0eb',

        pdStartAfterCurrentPledge: 'b2a6980f-16bd-4b7c-90cc-e48fca5ec006',
        wantOrnament: '4491de02-2e66-475c-992e-b70b4355187c',
        givingTuesdayAmbassador: 'b2a089de-b3e9-4c41-958d-07a081565159',

        // Acknowledgee information
        AcknowledgeeTitle: "446bf4a6-e365-468d-bad0-37ce30b0e188",
        AcknowledgeeFirstName: "91ca3e25-5831-40fe-9b7a-957f9608b8dd",
        AcknowledgeeLastName: "3a7e79d5-f5f7-4fd8-8031-77f56b08b255",
        AcknowledgeeSuffix: "966325b2-e253-448f-bd59-857d0bcb63bd",
        AcknowledgeeCity: "f2a00e58-4d26-4c5f-a3c2-9403eb50bd18",
        AcknowledgeeCountry: "cca52f5c-97eb-4a5d-b3ac-4d7ed9b036a4",
        AcknowledgeeEmail: "93973031-17fc-49d2-a676-70544930a874",
        AcknowledgeePhone: "030061fe-6a62-4e4d-8129-bc0b60f1ea00",
        AcknowledgeeState: "44b0f3c0-c4d6-4343-8355-943fb4703990",
        AcknowledgeeStreetAddress: "16a044a1-2171-4d1d-8029-48d4cba9f5dc",
        AcknowledgeeZipCode: "f20b1f0b-14a1-40fe-94a6-1c6362db1d17",
        AcknowledgeeHonorName: "6337f9a2-c611-47f9-a81c-bcb01f457467",
        AcknowledgeeTributeGiftType: "7b877e86-532a-4851-a1b1-7cd777fd08ec"
    },

    Methods: {
        pageInit: function() {
            // runs on partial page refresh
            Sys.WebForms.PageRequestManager.getInstance().add_pageLoaded(function() {
                ADF.Methods.pageRefresh();
            });

            // runs on full page load
            $(document).ready(function() {
                ADF.Methods.pageLoad();
            });
        },

        // page refresh
        pageRefresh: function() {
            // nothing to see here...
        },

        // full page load
        pageLoad: function() {
            if ($('.BBDonationApiContainer').length !== 0) {
                // ADF.Methods.hiddenForm();
                // ADF.Methods.getPublicKey();
                // ADF.Methods.getEditorInformation();

                ADF.Methods.initAdf();
                ADF.Methods.buttonGroup();
                ADF.Methods.fundList();
                ADF.Methods.fundSearch();
                // ADF.Methods.matchingGiftSearch();
                ADF.Methods.validationMarkers();
                ADF.Methods.giftOptions();
                // ADF.Methods.procFee();
                // ADF.Methods.populateCountryDropdowns();
                // ADF.Methods.getCountryState();
                ADF.Methods.getTitle();
                ADF.Methods.datePicker();
                ADF.Methods.calculateInstallments();
                ADF.Methods.queryParameters();
            }
        },

        // returns a single value from the URL (pass in name of value)
        returnQueryValueByName: function(name) {
            return BLACKBAUD.api.querystring.getQueryStringValue(name);
        },

        // returns all query string parameters from a URL
        getUrlVars: function(url) {
            var vars = [],
                hash, hashes = url.slice(url.indexOf('?') + 1).split('&');
            for (var i = 0; i < hashes.length; i++) {
                hash = hashes[i].split('=');
                vars.push(hash[0]);
                vars[hash[0]] = hash[1];
            }
            return vars;
        },

        // hidden checkout form
        // hiddenForm: function() {
        //     if ($('form[data-formtype="bbCheckout"]').length <= 0) {
        //         var form = '<form method=\'get\' id=\"paymentForm\" data-formtype=\'bbCheckout\' data-disable-submit=\'true\' novalidate><\/form>';
        //         $('body').prepend(form);
        //     }
        // },

        // get public key
        // getPublicKey: function() {
        //     var onPublicKeySuccess = function(data) {
        //         ADF.Defaults.publicKey = JSON.parse(data.Data).PublicKey;
        //     };

        //     var onPublicKeyFailure = function(error) {
        //         console.log(error);
        //     };

        //     donationService.getCheckoutPublicKey(onPublicKeySuccess, onPublicKeyFailure);
        // },

        // get editor information
        // getEditorInformation: function() {
        //     var partId = ADF.Defaults.partId;

        //     var onEditorContentSuccess = function(content) {
        //         ADF.Defaults.editorContent = content;
        //         ADF.Defaults.MerchantAccountId = "864426b2-20a0-43aa-95f6-c850d757b026";
        //     };

        //     var onEditorContentFailure = function(error) {
        //         console.log(error);
        //     };

        //     donationService.getADFEditorContentInformation(partId, onEditorContentSuccess, onEditorContentFailure);
        // },

        // get confirmation html
        getConfirmation: function(id) {
            var confirmationSuccess = function(content) {
                $('#adfWrapper').hide();
                $('#adfConfWrapper').removeClass('hidden').html(content);
            };

            var confirmationError = function(error) {
                $('#adfWrapper').hide();
                $('#adfConfWrapper').removeClass('hidden').html('<p>' + ADF.Methods.convertErrorsToHtml(error) + '</p>');
            };

            donationService.getDonationConfirmationHtml(id, confirmationSuccess, confirmationError);
        },

        // process credit card payment
        // processCCPayment: function(data) {
        //     var onValidationSuccess = function() {
        //         ADF.Methods.makePayment(data);
        //         return false;
        //     };

        //     var onValidationFailed = function(error) {
        //         $('#adfError').html('<span class="fas fa-exclamation-circle"></span><p>' + ADF.Methods.convertErrorsToHtml(error) + '</p>');
        //         $('#adfError').show();
        //     };

        //     donationService.validateDonationRequest(data, onValidationSuccess, onValidationFailed);
        // },

        // create donation for pledge (bill me later)
        // billMeLater: function(data) {
        //     var donationSuccess = function(data) {
        //         ADF.Methods.getConfirmation(data.Donation.Id);
        //     };

        //     var donationFail = function(error) {
        //         $('#adfError').html('<span class="fa fa-exclamation-circle"></span><p>' + ADF.Methods.convertErrorsToHtml(error) + '</p>');
        //         $('#adfError').show();
        //     };

        //     donationService.createDonation(data, donationSuccess, donationFail);
        // },

        // blackbaud checkout (credit card)
        // makePayment: function(data) {
        //     // reset openend status
        //     ADF.Defaults.opened = false;

        //     var handleCheckoutComplete = function(event, token) {
        //         if (event && event.detail && event.detail.transactionToken) {
        //             // complete donation
        //             data.TokenId = event.detail.transactionToken;
        //             donationService.checkoutDonationComplete(data, handlePaymentComplete, handleDonationCreateFailed);

        //             // show overlay
        //             $('#bbcheckout-background-overlay').show();
        //         } else {
        //             ADF.Methods.handleError();
        //         }

        //         ADF.Methods.unBindPaymentCheckoutEvents();
        //         return false;
        //     };

        //     var handleCheckoutError = function() {
        //         ADF.Methods.handleError();
        //     };

        //     var handleCheckoutCancelled = function() {
        //         try {
        //             donationService.checkoutDonationCancel(data, onSuccess, onFail);
        //         } catch (err) {
        //             // nothing to see here...
        //         }

        //         ADF.Methods.unBindPaymentCheckoutEvents();
        //     };

        //     var handleCheckoutLoaded = function() {
        //         if (!ADF.Defaults.opened) {
        //             // set opened status
        //             ADF.Defaults.opened = true;

        //             // get transaction id
        //             var url = $('#bbcheckout-iframe').attr('src'),
        //                 tid = ADF.Methods.getUrlVars(url).t;

        //             if (tid) {
        //                 data.TokenId = tid;
        //                 donationService.checkoutDonationCreate(data, handleDonationCreated, handleDonationCreateFailed);
        //                 return false;
        //             }
        //         }

        //         return false;
        //     };

        //     var handleDonationCreated = function(data) {
        //         // get order id
        //         ADF.Defaults.orderId = JSON.parse(data.Data).OrderId;
        //     };

        //     var handleDonationCreateFailed = function() {
        //         ADF.Methods.handleError();
        //     };

        //     var handlePaymentComplete = function(data) {
        //         // hide overlay
        //         $('#bbcheckout-background-overlay').first().hide();

        //         // show confirmation html
        //         $('#adfWrapper').hide();
        //         $('#adfConfWrapper').removeClass('hidden').html(JSON.parse(data.Data).confirmationHTML);
        //     };

        //     // checkout service
        //     var checkout = new SecureCheckout(handleCheckoutComplete, handleCheckoutError, handleCheckoutCancelled, handleCheckoutLoaded),
        //         donor = data.Donor,
        //         checkoutData = {
        //             Amount: $('.total-amount span').text().replace('$', '').replace(',', ''),
        //             BillingAddressCity: donor.Address.City,
        //             BillingAddressCountry: donor.Address.Country,
        //             BillingAddressEmail: donor.EmailAddress,
        //             BillingAddressFirstName: donor.FirstName,
        //             BillingAddressLastName: donor.LastName,
        //             BillingAddressLine: donor.Address.StreetAddress,
        //             BillingAddressPostCode: donor.Address.PostalCode,
        //             BillingAddressState: donor.Address.State,
        //             Cardholder: donor.FirstName + ' ' + donor.LastName,
        //             ClientAppName: 'University of Cincinnati Foundation ADF',
        //             FontFamily: ADF.Defaults.editorContent.FontType,
        //             IsEmailRequired: true,
        //             IsNameVisible: true,
        //             MerchantAccountId: "864426b2-20a0-43aa-95f6-c850d757b026",
        //             PrimaryColor: ADF.Defaults.editorContent.PrimaryFontColor,
        //             SecondaryColor: ADF.Defaults.editorContent.SecondaryFontColor,
        //             UseApplePay: ADF.Defaults.editorContent.UseApplePay,
        //             UseCaptcha: ADF.Defaults.editorContent.RecaptchRequired,
        //             UseMasterpass: ADF.Defaults.editorContent.UseMasterPass,
        //             UseVisaCheckout: ADF.Defaults.editorContent.UseVisaPass,
        //             key: ADF.Defaults.publicKey
        //         };

        //     // set card token (recurring gift)
        //     if (data.Gift && data.Gift.Recurrence) {
        //         checkoutData.CardToken = ADF.Defaults.editorContent.DataKey;
        //     }

        //     // process today or later (recurring gift)
        //     if (data.Gift && data.Gift.Recurrence && !data.Gift.Recurrence.ProcessNow) {
        //         return checkout.processStoredCard(checkoutData);
        //     } else {
        //         return checkout.processCardNotPresent(checkoutData);
        //     }
        // },

        // handle generic checkout error
        handleError: function() {
            // alert(ADF.Defaults.checkoutError);
            window.location.forcedReload(true);
        },

        // unbind checkout events
        unBindPaymentCheckoutEvents: function() {
            $(document).unbind('checkoutComplete');
            $(document).unbind('checkoutLoaded');
            $(document).unbind('checkoutError');
            $(document).unbind('checkoutCancel');
        },

        // initialize ADF
        initAdf: function() {
            setTimeout(function() {
                //highlight query param amount
            }, 300);

            // legacy browser support for placeholder attributes
            // $('input:not(".tt-hint"), textarea').placeholder();

            // submit button event
            $('#adfSubmit').on('click', function(e) {
                // prevent default action
                e.preventDefault();

                // form validation
                if ($('.fund-card.empty').is(':visible')) {
                    $('#adfError').html('<span class="fas fa-exclamation-circle"></span><p>Please select a fund from above and enter an amount.</p>');
                    $('#adfError').show();
                } else if (ADF.Methods.validateADF()) {
                    // hide error
                    $('#adfError').hide();

                    console.log("right here!");

                    // get donation data
                    $(this)
                        .addClass("disabled")
                        .unbind("click");
                    ADF.Methods.getDonationData();
                    // var data = ADF.Methods.getDonationData();

                    // credit card or bill me later
                    // if (ADF.Defaults.editorContent && ADF.Defaults.editorContent.MACheckoutSupported && data.Gift.PaymentMethod === 0) {
                    //     ADF.Methods.processCCPayment(data);
                    // } else {
                    //     ADF.Methods.billMeLater(data);
                    // }
                } else {
                    // reset error
                    $('#adfError').html('<span class="fas fa-exclamation-circle"></span><p>Some required information is missing. Form submission is disabled until all required information is entered.</p>');
                }
            });
        },

        // button group functionality
        buttonGroup: function() {
            var button = $('.button-group .btn');

            // toggle active class
            button.on('click', function() {
                $(this).addClass('active');
                $(this).siblings().removeClass('active');
            });
        },

        // fund list
        fundList: function() {
            // fund list container
            var fundList = $('#fundList'),
                areaSupportSelect = $("#areaSupportSelect"),
                collegeUnitSelect = $("#collegeUnitSelect"),
                collegeUnitToggle = $(".collegeUnitToggle"),
                fundToggle = $(".fundToggle"),
                fundSelect = $("#fundSelect");

            // designation variables
            var query = new BLACKBAUD.api.QueryService(),
                results = [];
            // data = ADF.Defaults.emergencyData;

            // filter unique values
            function onlyUnique(value, index, self) {
                return self.indexOf(value) === index;
            }

            let areaToSupport = ["The UC Fund", "Scholarships", "UC Health", "Colleges/Units"];

            // get results
            query.getResults(ADF.Defaults.designationQuery, function(data) {
                // clean results
                var fields = data.Fields,
                    rows = data.Rows,
                    fieldArray = [];

                $.each(fields, function(key, value) {
                    fieldArray[value.Name] = key;
                });

                $.each(rows, function() {
                    var values = this.Values;
                    if (values[8] != "") {
                        results.push({
                            name: values[1], // values[3],
                            id: values[6], // values[4],
                            cat: values[8], // values[3],
                            subcat: values[9].substring(values[9].indexOf("-") + 1).trim() // values[3],
                        });
                    }
                });

                var count = 0;
                $.each(areaToSupport, function(key1, value) {
                    // build html structure for categories
                    areaSupportSelect.append('<option value="' + value + '" class="des-cat cat-' + key1 + '">' + value + '</option>');
                    count++;
                    if (count == areaToSupport.length) {
                        ADF.Methods.hideQueryLoader();
                    }
                });

                // filter unique values
                function onlyUnique(value, index, self) {
                    return self.indexOf(value) === index;
                }

                // get categories
                var category = results.map(function(obj) {
                    return obj.cat;
                });

                // populate unique categories
                var uniqueCat = category.filter(onlyUnique);

                // uniqueCat.push(uniqueCat.shift());
                // uniqueCat.push(uniqueCat.shift());

                /*$.each(uniqueCat, function(key1, value1) {
                    // build html structure for categories
                    fundList.append('<div class="des-block"><div class="des-cat cat-' + key1 + '">' + value1 + '</div><div class="des-group"></div></div>');

                    // filter categories
                    var filterCat = $.grep(results, function(v) {
                        return v.cat === value1;
                    });

                    // get sub-categories from category filter
                    var subCategory = filterCat.map(function(obj) {
                        return obj.subcat;
                    });

                    // populate unique sub-categories
                    var uniqueSubCat = subCategory.filter(onlyUnique);
                    $.each(uniqueSubCat, function(key2, value2) {
                        // build html structure for sub-categories
                        if (value1 == 'The UC Fund' || value1 == 'Scholarships') {
                            fundList.find('.cat-' + key1).next().append('<div class="des-area one-level"><div class="des-subcat subcat-' + key2 + '" style="display: none"></div><div class="des-select" style="display: block"></div></div>');
                        } else {
                            fundList.find('.cat-' + key1).next().append('<div class="des-area"><div class="des-subcat subcat-' + key2 + '">' + value2 + '</div><div class="des-select"></div></div>');
                        }

                        // filter designations
                        var filterDes = $.grep(results, function(v) {
                            return v.cat === value1 && v.subcat === value2;
                        });

                        // populate designations
                        $.each(filterDes, function(key3, value3) {
                            var desId = value3.id,
                                desName = value3.name,
                                desCat = value3.cat,
                                desSubcat = value3.subcat,
                                desInput = desId + '-' + desName.replace(/(_|\W)/g, '').toLowerCase();

                            // build html structure for designations
                            fundList.find('.cat-' + key1).next().find('.subcat-' + key2).next().append('\
                                <div class="checkbox">\
                                    <input  type="checkbox"\
								            aria-labelledby="value-' + desId + '"\
                                            onfocus="parentFocus(event)"\
                                            onblur="parentBlur(event)"\
                                            tabindex="0"\
								            id="' + desId + '"\
                                            value="' + desId + '"\
								            onclick="checkboxPressed(event)"\
                                            data-cat="' + desCat + '"\
                                            data-subcat="' + desSubcat + '"\
								            aria-controls="giftSummary">\
                                    <label for="' + desId + '"\
								            id="value-' + desId + '">' + desName + '</label>\
                                </div>\
                            ');
                            // fundList.find('.cat-' + key1).next().find('.subcat-' + key2).next().append('<div class="checkbox"><input type="checkbox" id="' + desInput + '" value="' + desId + '" data-cat="' + desCat + '" data-subcat="' + desSubcat + '"><label for="' + desInput + '">' + desName + '</label></div>');
                        });
                    });
                });*/

                // ADF.Methods.hideQueryLoader();

                // run fund selection
                // ADF.Methods.fundCards();
            });

            // run fund selection
            ADF.Methods.fundCards();

            $(areaSupportSelect).on("change", function() {
                collegeUnitSelect.prop("selectedIndex", 0).find('option').not("option:first").remove();
                fundSelect.prop("selectedIndex", 0).find('option').not("option:first").remove();

                var selection = $(this).val();
                // filter categories based on selection
                var filterCat = $.grep(results, function(v) {
                    return v.cat === selection;
                });

                // get sub-categories from category filter
                var subCategory = filterCat.map(function(obj) {
                    return obj.subcat;
                });

                function Ascending_sort(a, b) {
                    return $(b)
                        .text().toUpperCase() < $(a)
                        .text().toUpperCase() ? 1 : -1;
                }

                // populate unique sub-categories
                var uniqueSubCat = subCategory.filter(onlyUnique);
                if (selection == "Colleges/Units") {
                    $(collegeUnitToggle).slideDown();
                    $(fundToggle).slideUp();

                    $.each(uniqueSubCat, function(key, value) {
                        var trimmedValue = value.substring(value.indexOf("-") + 1);
                        $(collegeUnitSelect).append($('<option value="' + value + '">' + trimmedValue + '</option>'));
                    });

                    var collegeUnitSelectVar = document.getElementById("collegeUnitSelect"),
                        fundSelectVar = document.getElementById("fundSelect");
                    collegeUnitSelectVar.disabled = false;
                    fundSelectVar.disabled = true;
                    collegeUnitSelectVar.setAttribute("selectedIndex", 0);

                    $(collegeUnitSelect).focus();
                    $("#collegeUnitSelect option:not(:first)")
                        .sort(Ascending_sort)
                        .appendTo("#collegeUnitSelect");
                } else if (selection == "Scholarships" || selection == "The UC Fund" || selection == "UC Health") {
                    $(collegeUnitToggle).slideUp();
                    $(fundToggle).slideDown();

                    $.each(filterCat, function(key, value) {
                        $(fundSelect).append(
                            $(
                                '<option data-cat="' + value.cat + '" data-subcat="' + value.subcat + '" value="' +
                                value.id +
                                '">' +
                                value.name.split("(")[0].trim() +
                                '</option>'
                            )
                        );
                    });

                    var collegeUnitSelectVar = document.getElementById("collegeUnitSelect"),
                        fundSelectVar = document.getElementById("fundSelect");
                    collegeUnitSelectVar.disabled = true;
                    fundSelectVar.disabled = false;
                    collegeUnitSelectVar.setAttribute("selectedIndex", 0);

                    $(fundSelect).focus();
                    $("#fundSelect option:not(:first)")
                        .sort(Ascending_sort)
                        .appendTo("#fundSelect");
                }
                // else if (selection == "Type your own fund") {
                //     $(".toggleOtherFund").slideDown();
                //     $("#otherArea").focus();

                //     var position = $($("#otherArea")).offset().top;
                //     $("body, html").animate({
                //             scrollTop: position - 60
                //         },
                //         700
                //     );
                // }
                else {
                    // do nothing
                }
            });

            // sub-category menu (level 2)
            $(collegeUnitSelect).on("change", function() {
                $(fundToggle).slideDown();

                // remove all options in designation menu except the first
                $(fundSelect).focus().prop("selectedIndex", 0).find("option").not("option:first").remove();

                // define category and sub-category selections
                var selection1 = $(areaSupportSelect).val();
                var selection2 = $(this).val();

                // filter designations based on category and sub-category selections
                var filterSubCat = $.grep(results, function(v) {
                    return v.cat === selection1 && v.subcat === selection2;
                });

                // populate designations
                $.each(filterSubCat, function(key, value) {
                    $(fundSelect).append(
                        $(
                            '<option data-cat="' + value.cat + '" data-subcat="' + value.subcat + '" value="' +
                            value.id +
                            '">' +
                            value.name.split("(")[0].trim() +
                            '</option>'
                        )
                    );
                });

                var fundSelectVar = document.getElementById("fundSelect");
                fundSelectVar.disabled = false;

                function Ascending_sort(a, b) {
                    return $(b)
                        .text().toUpperCase() < $(a)
                        .text().toUpperCase() ? 1 : -1;
                }

                $("#fundSelect option:not(:first)")
                    .sort(Ascending_sort)
                    .appendTo(fundSelect);
            });
        },

        // fund search
        fundSearch: function() {
            // typeahead variables
            var typeahead = $('#desSearch'),
                query = new BLACKBAUD.api.QueryService(),
                results = [];
            // data = ADF.Defaults.emergencyData;

            // console.log(data);

            // get results
            query.getResults(ADF.Defaults.designationQuery, function(data) {
                // clean results
                results = [];
                var fields = data.Fields,
                    rows = data.Rows,
                    fieldArray = [];

                $.each(fields, function(key, value) {
                    fieldArray[value.Name] = key;
                });

                $.each(rows, function() {
                    var values = this.Values;
                    results.push({
                        value: values[6],
                        label: values[0],
                        cat: values[8],
                        subcat: values[9]
                            // value: values[4],
                            // label: values[3],
                            // cat: values[1],
                            // subcat: values[2]
                    });
                });

                // initialize suggestion engine
                // var search = new Bloodhound({
                //     // datumTokenizer: Bloodhound.tokenizers.obj.whitespace('label', 'cat', 'subcat'),
                //     datumTokenizer: Bloodhound.tokenizers.obj.whitespace('label'),
                //     queryTokenizer: Bloodhound.tokenizers.whitespace,
                //     local: results
                // });

                var search = new Bloodhound({
                    // datumTokenizer: Bloodhound.tokenizers.obj.whitespace('label', 'cat', 'subcat'),
                    datumTokenizer: Bloodhound.tokenizers.obj.whitespace('label'),
                    queryTokenizer: Bloodhound.tokenizers.whitespace,
                    local: results,
                    sorter: function(a, b) {

                        //get input text
                        var InputString = $("#desSearch").val();

                        //move exact matches to top
                        if (InputString == a.value) { return -1; }
                        if (InputString == b.value) { return 1; }

                        //close match without case matching
                        if (InputString.toLowerCase() == a.value.toLowerCase()) { return -1; }
                        if (InputString.toLowerCase() == b.value.toLowerCase()) { return 1; }

                        if ((InputString != a.value) && (InputString != b.value)) {

                            if (a.value < b.value) {
                                return -1;
                            } else if (a.value > b.value) {
                                return 1;
                            } else return 0;
                        }
                    }
                });

                // initialize typeahead plugin
                var typeaheadInit = search.initialize();
                typeaheadInit.done(function() {
                    typeahead.typeahead({
                        highlight: true,
                        minLength: 2
                    }, {
                        display: 'label',
                        name: 'search',
                        source: search,
                        limit: 'Infinity',
                        templates: {
                            empty: function() {
                                return '<div class="no-match">No results found</div>';
                            },
                            suggestion: function(data) {
                                var categoryText = "";

                                if (data.cat) {
                                    categoryText = data.cat + ' / ';
                                } else {
                                    // categoryText
                                }
                                return '<div><p class="tt-hierarchy">' + categoryText + data.subcat.substring(data.subcat.indexOf("-") + 1).trim() + '</p><p class="tt-label">' + data.label + '</div>';
                                // return '<div><p class="tt-hierarchy">' + data.cat + ' / ' + data.subcat + '</p><p class="tt-label">' + data.label + '</div>';
                            }
                        }
                    }).on('typeahead:select', function(e, datum) {
                        $(this).data({
                            value: datum.value,
                            label: datum.label,
                            cat: datum.cat,
                            subcat: datum.subcat,
                            id: datum.value + '-' + datum.label.replace(/(_|\W)/g, '').toLowerCase()
                        });
                        ADF.Methods.addFund($(this));
                        clearSearch();
                    }).on('typeahead:change', function() {
                        if ($.trim($(this).typeahead('val')) === '') {
                            clearSearch();
                        }
                    });
                }).fail(function() {
                    console.log('unable to parse designation query');
                });

                // clear search field
                function clearSearch() {
                    typeahead.typeahead('val', '').typeahead('close');
                    typeahead.removeData();
                }

                // autopopulate designation from url
                var guid = ADF.Methods.returnQueryValueByName('fund');
                if (!!guid) {
                    var label = results.filter(function(obj) {
                        return obj.value === guid;
                    })[0].label;
                    typeahead.data('value', guid).typeahead('val', label);
                }
            });
        },

        // matching gift search
        matchingGiftSearch: function() {
            // field variables
            var companySearch = $('#matchingGiftName'),
                searchResults = $('#matchingGiftSearchResults');

            // api variables
            var x2js = new X2JS(),
                key = ADF.Defaults.hepKey;

            // clear results
            function clearResults() {
                searchResults.find('ol').html('');
                $('.no-results').remove();
            }

            // currency formatting
            function formatCurrency(currencyString) {
                return parseFloat(currencyString).toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD'
                });
            }

            // search button keypress event (enter key)
            companySearch.on('keypress', function(e) {
                if ($(this).val() !== '' && $(this).is(':focus') && e.which === 13) {
                    e.preventDefault();
                    $('.hep-search').click();
                }
            });

            // search button click event
            $('.hep-search').on('click', function(e) {
                // prevent default action
                e.preventDefault();

                // clear results
                clearResults();

                // loading indicator
                searchResults.append('<p class="loading"><small>Loading...</small></p>');

                // search input value
                var searchValue = companySearch.val();

                // get companies
                $.get('https://automatch.matchinggifts.com/name_searches/xml/' + key + '/' + searchValue, function() {
                    // nothing to see here...
                }).done(function(data) {
                    // remove loading indicator
                    $('.loading').remove();

                    // data variables
                    var dataObj = x2js.xml2json(data),
                        count = dataObj.companies.count,
                        companies = dataObj.companies.company;

                    if (!!companies) {
                        // loop through companies
                        $(companies).each(function(i, v) {
                            // company variables
                            var companyId = v.company_id,
                                name = v.name;

                            searchResults.find('ol').append('<li><a href="#companyDetails" class="company" href="#" data-company-id="' + companyId + '" data-company-name="' + name + '">' + name + '</a></li>');
                        });
                    } else {
                        // no companies found
                        searchResults.append('<p class="no-results"><small>Sorry, "' + searchValue + '" was not found. Please check the spelling and re-submit.</small></p>');
                    }
                }).fail(function(errorThrown) {
                    console.log(errorThrown);
                }).always(function() {
                    // company link click event
                    $('.company').on('click', function() {
                        // company id (data attribute)
                        var companyId = $(this).data('company-id');

                        // company name (data attribute)
                        var companyName = $(this).data('company-name');

                        // get company details
                        $.get('https://automatch.matchinggifts.com/profiles/xml/' + key + '/' + companyId, function() {
                            // nothing to see here...
                        }).done(function(data) {
                            // data variables
                            var dataObj = x2js.xml2json(data),
                                company = dataObj.company,
                                subsidiaryOf = company.name,
                                companyId = company.company_id,
                                lastUpdated = company.last_updated,
                                contact = company.contact,
                                phone = company.contact_phone,
                                email = company.contact_email,
                                giftFormURL = company.online_resources.online_resource.matching_gift_form,
                                guide = company.online_resources.online_resource.guide,
                                minMatch = company.giftratios.minimum_amount_matched,
                                maxMatch = company.giftratios.maximum_amount_matched,
                                totalPerEmployee = company.giftratios.total_amount_per_employee,
                                giftRatio = company.giftratios.giftratio,
                                comments = company.comments,
                                procedure = Object.keys(company.procedure).map(function(i) {
                                    return company.procedure[i];
                                }).filter(Boolean),
                                companyDetails = $('<div><a href="#_" class="close"><span class="fas fa-fw fa-times"></span></a><strong>Company:</strong> ' + companyName + '<br><strong>Subsidiary of:</strong> ' + subsidiaryOf + '<br><strong>Foundation #:</strong> ' + companyId + '<br><strong>Last Updated:</strong> ' + lastUpdated + '<br><strong>Contact:</strong> ' + contact + '<br><strong>Phone:</strong> <a href="tel:' + phone + '">' + phone + '</a><br><strong>E-Mail:</strong> <a href="mailto:' + email + '">' + email + '</a><br><strong>Matching Gift Form URL:</strong> <a href="' + giftFormURL + '" target="_blank">' + giftFormURL + '</a><br><strong>Matching Gift Guidelines URL:</strong> <a href="' + guide + '" target="_blank">' + guide + '</a><br><strong>Minimum amount matched:</strong> ' + formatCurrency(minMatch) + '<br><strong>Maximum amount matched:</strong> ' + formatCurrency(maxMatch) + '<br><strong>Total per employee:</strong> ' + formatCurrency(totalPerEmployee) + '<br><strong>Gift ratio:</strong> ' + giftRatio + '<br><br><strong>Comments:</strong> ' + comments + '<br><br><strong>Procedure:</strong><br><ul><li>' + procedure.join('</li><li>') + '</li></ul><br><p><a href="#_" class="button select-company" data-select="' + companyName + '">Select Company</a><a href="#_" class="button return-to-list">Return to List</a></p></div>');

                            // reset company details
                            $('#companyDetails').html('');
                            companyDetails.appendTo('#companyDetails');

                            // select company click event
                            $('.select-company').on('click', function() {
                                // populate field value
                                companySearch.val($(this).data('select'));

                                // clear results
                                clearResults();
                            });
                        }).fail(function(errorThrown) {
                            console.log(errorThrown);
                        });
                    });
                });
            });
        },

        hideQueryLoader: function() {
            $("#queryLoader").slideUp();
            $(".fundSelect").slideDown();
            // $(".fund-list").slideDown();
        },

        // fund card events
        fundCards: function() {
            // designation category
            // $('.des-cat').each(function() {
            //     $(this).on('click', function() {
            //         $(this).toggleClass('expanded');
            //         $(this).next().slideToggle(200);
            //         if ($(this).hasClass('expanded')) {
            //             $(this).closest('.des-block').addClass('expanded');
            //         } else {
            //             $(this).closest('.des-block').removeClass('expanded');
            //         }
            //     });
            // });
            $('.des-cat').each(function() {
                $(this).on('click', function() {
                    $(this).toggleClass('expanded');

                    // toggle the aria expanded tag
                    if (this.getAttribute('aria-expanded') === 'true') {
                        this.setAttribute('aria-expanded', 'false');
                    } else {
                        this.setAttribute('aria-expanded', 'true');
                    }

                    // toggle the aria expanded tag and the expanded class for the parent designation block
                    $(this).next().slideToggle(200);
                    if ($(this).hasClass('expanded')) {
                        $(this).closest('.des-block').addClass('expanded');
                        this.closest('.des-block').setAttribute('aria-expanded', 'true');
                    } else {
                        $(this).closest('.des-block').removeClass('expanded');
                        this.closest('.des-block').setAttribute('aria-expanded', 'false');
                    }
                });
            });

            // designation category (keyboard navigation)
            $('.des-cat').each(function() {
                $(this).on('keyup', function(e) {
                    // if the enter key  was pressed, expand the accordian and toggle expanded flags
                    if (e.which == 13) {
                        $(this).toggleClass('expanded');
                        if (this.getAttribute('aria-expanded') === 'true') {
                            this.setAttribute('aria-expanded', 'false');
                        } else {
                            this.setAttribute('aria-expanded', 'true');
                        }
                        $(this).next().slideToggle(200);
                        if ($(this).hasClass('expanded')) {
                            $(this).closest('.des-block').addClass('expanded');
                            this.closest('.des-block').setAttribute('aria-expanded', 'true');
                        } else {
                            $(this).closest('.des-block').removeClass('expanded');
                            this.closest('.des-block').setAttribute('aria-expanded', 'false');
                        }
                    }
                });
            });

            // designation sub-category
            // $('.des-subcat').each(function() {
            //     $(this).on('click', function() {
            //         $(this).toggleClass('expanded');
            //         $(this).next().slideToggle(200);
            //     });
            // });

            $('.des-subcat').each(function() {
                $(this).on('click', function() {
                    $(this).toggleClass('expanded');
                    if (this.getAttribute('aria-expanded') === 'true') {
                        this.setAttribute('aria-expanded', 'false');
                    } else {
                        this.setAttribute('aria-expanded', 'true');
                    }
                    $(this).next().slideToggle(200);
                });
            });

            // designation sub-category (keyboard navigation)
            $('.des-subcat').each(function() {
                $(this).on('keyup', function(e) {
                    if (e.which == 13) {
                        $(this).toggleClass('expanded');
                        if (this.getAttribute('aria-expanded') === 'true') {
                            this.setAttribute('aria-expanded', 'false');
                        } else {
                            this.setAttribute('aria-expanded', 'true');
                        }
                        $(this).next().slideToggle(200);
                    }
                });
            });

            // designation selection
            // $('.des-select .checkbox label').on('click', function() {
            //     if (!$(this).prev('input').is(':checked')) {
            //         ADF.Methods.addFund($(this));
            //     } else {
            //         var id = $(this).prev('input').attr('id');
            //         ADF.Methods.removeFund(id);
            //     }
            // });

            // fund card event (blur)
            $('#giftSummary').on('blur', '.fund-card input', function() {
                if (!isNaN($(this).val())) {
                    if (Number($(this).val()) < 1.00) {
                        $(this).val('0.00');
                        if ($(this).next('.min-amount').length === 0) {
                            $(this).parent().append('<p class="min-amount">Please enter a minimum of $1.</p>');
                        }
                    } else {
                        if ($(this).next('.min-amount').length !== 0) {
                            $(this).next('.min-amount').remove();
                        }
                        var newVal = parseFloat($(this).val(), 10).toFixed(2);
                        $(this).val(newVal);
                        ADF.Methods.updateTotal();
                    }
                } else {
                    $(this).val('0.00');
                }
            });

            // fund card events (change keyup focusout input paste)
            $('#giftSummary').on('change keyup focusout input paste', '.fund-card input', function(e) {
                if (!isNaN($(this).val())) {
                    // update total amount
                    ADF.Methods.updateTotal();

                    // update pledge summary
                    if ($('#pledgeGift').is(':checked')) {
                        // ADF.Methods.pledgeSummary();
                    }
                }
            });

            // remove fund
            $('#giftSummary').on('click', '.remove-fund', function(e) {
                e.preventDefault();
                var id = $(this).closest('.fund-card').data('id');
                $('.des-select').find('#' + id).prop('checked', false);
                ADF.Methods.removeFund(id);

                // update pledge summary
                if ($('#pledgeGift').is(':checked')) {
                    // ADF.Methods.pledgeSummary();
                }
            });
        },

        // add to cart
        addFund: function(elem) {
            // hide empty card
            if ($('.fund-card.empty').is(':visible')) {
                $('.fund-card.empty').addClass('hidden');
            }

            // fund data
            var value, label, cat, subcat, id;
            if (elem.is('#desSearch')) {
                value = elem.data('value');
                label = elem.data('label');
                cat = elem.data('cat');
                subcat = elem.data('subcat');
                id = elem.data('id');

                // select corresponding checkbox in fund list
                $('.des-select').find('#' + id).prop('checked', true);
            } else if (elem.is('#fundSelect')) {
                value = $("#fundSelect option:selected").val();
                label = $("#fundSelect option:selected").text();
                cat = $("#fundSelect option:selected").data("cat");
                subcat = $("#fundSelect option:selected").data("subcat");
                id = $("#fundSelect option:selected").val();

                // value = elem.prev('input').val();
                // label = elem.text();
                // cat = elem.prev('input').data('cat');
                // subcat = elem.prev('input').data('subcat');
                // id = elem.prev('input').attr('id');
            } else if (elem.is('.add-other')) {
                value = $("#otherArea").data("guid");
                label = $("#otherArea").val();
                cat = "Other Fund";
                subcat = $("#otherArea").val();
                id = $("#otherArea").data("guid");

                $("#comments").val("Other Fund: " + label);
            }

            $("#otherArea").val("");

            // build fund card markup
            var card = $(
                '<div class="fund-card" data-id="' + id + '">' +
                '<div class="fund-card-header">' +
                '<p><span class="fund-cat">' + cat + '</span> / <span class="fund-subcat">' + subcat.substring(subcat.indexOf("-") + 1).trim() + '</span></p>' +
                '</div>' +
                '<div class="fund-card-block">' +
                '<div class="row">' +
                '<div class="g-5 t-g-2 relative remove-bottom"><p class="fund-name">' + label + '</p><p class="fund-guid hidden">' + value + '</p></div>' +
                '<div class="g-3 t-g-2 relative remove-bottom"><p class="symbol">$</p><input class="adfInput form-control required" type="text" placeholder="0.00" required></div>' +
                '</div>' +
                '</div>' +
                '<div class="fund-card-footer">' +
                '<a href="#" class="button remove-fund"><span class="fa fa-times"></span>&nbsp;&nbsp;Remove Gift</a>' +
                '</div>' +
                '</div>'
            );

            // insert fund card
            card.insertBefore('.proc-fee');

            // update total amount
            ADF.Methods.updateTotal();

            // update pledge summary
            // if ($('#pledgeGift').is(':checked')) {
            //     ADF.Methods.pledgeSummary();
            // }
        },

        addFund1: function(elem) {
            // hide empty card
            if ($('.fund-card.empty').is(':visible')) {
                $('.fund-card.empty').addClass('hidden');
            }

            // fund data
            var value, label, cat, subcat, id;
            if (elem.is('#desSearch')) {
                value = elem.data('value');
                label = elem.data('label');
                cat = elem.data('cat');
                subcat = elem.data('subcat');
                id = elem.data('id');

                // select corresponding checkbox in fund list
                $('.des-select').find('#' + id).prop('checked', true);
            } else if (elem.is('.des-select .checkbox label')) {
                value = elem.prev('input').val();
                label = elem.text();
                cat = elem.prev('input').data('cat');
                subcat = elem.prev('input').data('subcat');
                id = elem.prev('input').attr('id');
            }

            // build fund card markup
            var card = $(
                '<div class="fund-card" data-id="' + id + '">' +
                '<div class="fund-card-header">' +
                '<p><span class="fund-cat">' + cat + '</span> / <span class="fund-subcat">' + subcat.substring(subcat.indexOf("-") + 1).trim() + '</span></p>' +
                '</div>' +
                '<div class="fund-card-block">' +
                '<div class="row">' +
                '<div class="g-5 t-g-2 relative remove-bottom"><p class="fund-name">' + label + '</p><p class="fund-guid hidden">' + value + '</p></div>' +
                '<div class="g-3 t-g-2 relative remove-bottom"><p class="symbol">$</p><input class="adfInput form-control required" type="text" required></div>' +
                '</div>' +
                '</div>' +
                '<div class="fund-card-footer">' +
                '<a href="#" class="button remove-fund"><span class="fa fa-times"></span>&nbsp;&nbsp;Remove Gift</a>' +
                '</div>' +
                '</div>'
            );

            // insert fund card
            card.insertBefore('.proc-fee');

            // update total amount
            ADF.Methods.updateTotal();

            // update pledge summary
            if ($('#pledgeGift').is(':checked')) {
                // ADF.Methods.pledgeSummary();
            }
        },

        // remove fund
        removeFund: function(id) {
            // remove card
            if (!!id) {
                $('.fund-card[data-id="' + id + '"]').remove();
            }

            // no funds
            if ($('.fund-card').not('.empty, .proc-fee').length === 0) {
                $('.fund-card.empty').removeClass('hidden');
            }

            // update total amount
            ADF.Methods.updateTotal();

            // update pledge summary
            if ($('#pledgeGift').is(':checked')) {
                // ADF.Methods.pledgeSummary();
            }
        },

        // update total
        updateTotal: function() {
            // cart variables
            var cartTotal = $('.total-amount span'),
                total = 0,
                newTotal,
                formatter = new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                });

            // update processing fee
            // if ($('#processingFee').is(':checked')) {
            //     ADF.Methods.updateProcessingFee();
            // } else {
            //     $('.fund-card.proc-fee input').val('');
            // }

            // update total amount
            $('.fund-card input').each(function() {
                var amount = Number($(this).val());
                total += +parseFloat(amount, 10).toFixed(2);
            }).promise().done(function() {
                newTotal = parseFloat(total, 10).toFixed(2);
                cartTotal.text(formatter.format(newTotal));
            });
        },

        // update processing fee
        // updateProcessingFee: function() {
        //     // cache amount variables
        //     var total = 0;
        //     var subTotal = function() {
        //         // calculate cart subtotal
        //         $('.fund-card').not('.proc-fee').find('input').each(function() {
        //             total += +parseFloat($(this).val(), 10).toFixed(2);
        //         });

        //         // calculate 3% processing fee
        //         return parseFloat(total * 0.03, 10).toFixed(2);
        //     };

        //     // populate fund card amount
        //     $('.fund-card.proc-fee input').val(subTotal);

        //     // display processing fee
        //     $('#processingFee + label > span').text($('.fund-card.proc-fee input').val());
        // },

        // validation markers
        validationMarkers: function() {
            $('<span class="marker"></span>').insertBefore('.required');
        },

        // validate ADF
        validateADF: function() {
            // define validation status
            var isValid = true;

            // toggle validation classes on field edit
            $('.required:visible').each(function() {
                if ($.trim($(this).val()) === '' || $(this).val() === '-1' || $(this).is(':invalid')) {
                    isValid = false;
                    $(this).addClass('invalid');
                    $(this).parent().addClass('has-error');
                    $('html, body').stop().animate({
                        scrollTop: $('.invalid:first-of-type').offset().top - 100
                    }, 300);
                    $('#adfError').show();
                }
            });

            // focus on first invalid field
            $('.invalid:visible').first().focus();

            // toggle validation state on field edit
            $('.invalid').on('change keydown', function() {
                $(this).removeClass('invalid').parent().removeClass('has-error');

                if ($('.has-error').length === 0) {
                    // hide error
                    $('#adfError').hide();
                }
            });

            // return validation status
            return isValid;
        },

        // get donation data
        getDonationData: function() {
            // create donation object
            var partId = $(".BBDonationApiContainer").attr("data-partid"),
                donationService = new BLACKBAUD.api.DonationService(partId, {
                    url: ADF.Defaults.rootpath,
                    crossDomain: false,
                }),
                giftAmount = $("#custom-amount").val(),
                designationID = $("#designationId").val(),
                customAttributes = [],
                designationArray = [];
            var donation = {
                Gift: {
                    Designations: [],
                    IsAnonymous: false,
                    Attributes: [],
                    MerchantAccountId: ADF.Defaults.MerchantAccountId,
                    Comments: ""
                },
                Origin: {
                    AppealId: "",
                    PageId: ADF.Defaults.pageId,
                    PageName: 'Faculty/Staff Pledge'
                },
            };

            let billingtitle = $('#personalTitle option:selected').val().trim(),
                firstName = $('#personalFirstName').val(),
                lastName = $('#personalLastName').val(),
                address = $('#personalAddress').val(),
                addresstype = $('#personalAddressType option:selected').val(),
                country = $('#personalCountry option:selected').text().trim(),
                city = $('#personalCity').val(),
                state = $('#personalState option:selected').val(),
                zipcode = $('#personalZip').val(),
                phone = $('#personalPhone').val(),
                emailaddress = $('#personalEmail').val(),
                emailaddresstype = $('#personalEmailType option:selected').val();

            localStorage.setItem("billingtitle", billingtitle);
            localStorage.setItem("firstName", firstName);
            localStorage.setItem("lastName", lastName);
            localStorage.setItem("address", address);
            localStorage.setItem("addresstype", addresstype);
            localStorage.setItem("country", country);
            localStorage.setItem("city", city);
            localStorage.setItem("state", state);
            localStorage.setItem("zipcode", zipcode);
            localStorage.setItem("emailaddresstype", emailaddresstype);
            localStorage.setItem("phone", phone);
            localStorage.setItem("emailaddress", emailaddress);

            // assign designations (split gifts)
            $('.fund-card').not('.empty, .proc-fee:hidden').each(function() {
                var gift = {
                    Amount: $(this).find('input').val(),
                    DesignationId: $(this).find('.fund-guid').text()
                };
                donation.Gift.Designations.push(gift);
            });

            // AcknowledgeeTributeGiftType
            if ($('input[name="tributeType').is(':checked')) {
                var AcknowledgeeTributeGiftType = {
                    AttributeId: ADF.Defaults.AcknowledgeeTributeGiftType,
                    Value: $('input[name="tributeType"]:checked').val()
                };
                donation.Gift.Attributes.push(AcknowledgeeTributeGiftType);

                // AcknowledgeeHonorName
                var AcknowledgeeHonorName = {
                    AttributeId: ADF.Defaults.AcknowledgeeHonorName,
                    Value: $('#tributeFirstName').val() + " " + $('#tributeLastName').val()
                };
                donation.Gift.Attributes.push(AcknowledgeeHonorName);
            }

            // AcknowledgeeTitle
            // if ($('#AcknowledgeeTitle').val() !== '') {
            //     var AcknowledgeeTitle = {
            //         AttributeId: ADF.Defaults.AcknowledgeeFirstName,
            //         Value: $('#AcknowledgeeTitle').val()
            //     };
            //     donation.Gift.Attributes.push(AcknowledgeeFirstName);
            // }

            // AcknowledgeeFirstName
            if ($('#acknowledgeeFirstName').val() !== '') {
                var AcknowledgeeFirstName = {
                    AttributeId: ADF.Defaults.AcknowledgeeFirstName,
                    Value: $('#acknowledgeeFirstName').val()
                };
                donation.Gift.Attributes.push(AcknowledgeeFirstName);
            }

            // AcknowledgeeLastName
            if ($('#acknowledgeeLastName').val() !== '') {
                var AcknowledgeeLastName = {
                    AttributeId: ADF.Defaults.AcknowledgeeLastName,
                    Value: $('#acknowledgeeLastName').val()
                };
                donation.Gift.Attributes.push(AcknowledgeeLastName);
            }

            // AcknowledgeePhone
            if ($('#acknowledgeePhone').val() !== '') {
                var AcknowledgeePhone = {
                    AttributeId: ADF.Defaults.AcknowledgeePhone,
                    Value: $('#acknowledgeePhone').val()
                };
                donation.Gift.Attributes.push(AcknowledgeePhone);
            }

            // AcknowledgeeEmail
            if ($('#acknowledgeeEmail').val() !== '') {
                var AcknowledgeeEmail = {
                    AttributeId: ADF.Defaults.AcknowledgeeEmail,
                    Value: $('#acknowledgeeEmail').val()
                };
                donation.Gift.Attributes.push(AcknowledgeeEmail);
            }

            // AcknowledgeeCity
            if ($('#acknowledgeeCity').val() !== '') {
                var AcknowledgeeCity = {
                    AttributeId: ADF.Defaults.AcknowledgeeCity,
                    Value: $('#acknowledgeeCity').val()
                };
                donation.Gift.Attributes.push(AcknowledgeeCity);
            }

            // AcknowledgeeState
            if ($('#acknowledgeeState').val() !== '') {
                var AcknowledgeeState = {
                    AttributeId: ADF.Defaults.AcknowledgeeState,
                    Value: $('#acknowledgeeState').val()
                };
                donation.Gift.Attributes.push(AcknowledgeeState);
            }

            // AcknowledgeeStreetAddress
            if ($('#acknowledgeeAddress').val() !== '') {
                var AcknowledgeeStreetAddress = {
                    AttributeId: ADF.Defaults.AcknowledgeeStreetAddress,
                    Value: $('#acknowledgeeAddress').val()
                };
                donation.Gift.Attributes.push(AcknowledgeeStreetAddress);
            }

            // AcknowledgeeCountry
            if ($('#acknowledgeeCountry').val() !== '') {
                var AcknowledgeeCountry = {
                    AttributeId: ADF.Defaults.AcknowledgeeCountry,
                    Value: $('#acknowledgeeCountry option:selected').text()
                };
                donation.Gift.Attributes.push(AcknowledgeeCountry);
            }

            // AcknowledgeeZipCode
            if ($('#acknowledgeeZip').val() !== '') {
                var AcknowledgeeZipCode = {
                    AttributeId: ADF.Defaults.AcknowledgeeZipCode,
                    Value: $('#acknowledgeeZip').val()
                };
                donation.Gift.Attributes.push(AcknowledgeeZipCode);
            }

            // var solicitorAttribute = {
            // 	AttributeId: ADF.Defaults.solicitorCode,
            // 	Value: ADF.Methods.returnQueryValueByName('solicitor')
            // };
            // donation.Gift.Attributes.push(solicitorAttribute);

            // assign donor title and custom attributes
            try {
                // donor title
                if ($('#personalTitle').val() !== '-1') {
                    donation.Donor.Title = $('#personalTitle option:selected').text();
                }

                // if solicitor code is in URL
                // if (!!ADF.Methods.returnQueryValueByName('solicitor')) {
                // var solicitorAttribute = {
                //     AttributeId: ADF.Defaults.solicitorCode,
                //     Value: ADF.Methods.returnQueryValueByName('solicitor')
                // };
                // donation.Gift.Attributes.push(solicitorAttribute);
                // }

                // comments
                if ($('#comments').val() !== '') {
                    var comments = {
                        AttributeId: ADF.Defaults.comments,
                        Value: $('#comments').val()
                    };
                    donation.Gift.Attributes.push(comments);
                }

                // matching gift
                if ($('#matchingGift').is(':checked')) {
                    var matchingGift = {
                        AttributeId: ADF.Defaults.matchingGift,
                        Value: 'True'
                    };
                    donation.Gift.Attributes.push(matchingGift);

                    // matching gift company name
                    if ($('#matchingGiftSearch').val() !== '') {
                        var matchingGiftCompanyName = {
                            AttributeId: ADF.Defaults.matchingGiftCompanyName,
                            Value: $('#matchingGiftName').val()
                        };
                        donation.Gift.Attributes.push(matchingGiftCompanyName);
                    }
                }
            } catch (err) {
                console.log(err);
            }

            // conditional for anonymous
            if ($("#anonymous:checked").length !== 0) {
                console.log("is anonymous!");
                donation.Gift.IsAnonymous = true;
            }

            // conditional for do not start until existing/current pledge is completed
            // if ($('#startWhenCompleted').is(':checked')) {
            //     // donation.Gift.IsAnonymous = true;
            // }

            // conditional for corporate
            if ($('#corporateGift').is(':checked')) {
                donation.Gift.IsCorporate = true;
                donation.Donor.OrganizationName = $('#companyName').val();
            }

            // conditional for tribute
            if ($('#tributeGift').is(':checked') && !$('#ackLetter').is(':checked')) {
                donation.Gift.Tribute = {
                    TributeDefinition: {
                        Type: $('#tributeType input:checked').val(),
                        Description: 'New Tribute',
                        FirstName: $('#tributeFirstName').val(),
                        LastName: $('#tributeLastName').val()
                    }
                };
            }

            // conditional for tribute acknowledgement
            if ($('#tributeGift').is(':checked') && $('#ackLetter').is(':checked')) {
                donation.Gift.Tribute = {
                    TributeDefinition: {
                        Type: $('#tributeType input:checked').val(),
                        Description: 'New Tribute',
                        FirstName: $('#tributeFirstName').val(),
                        LastName: $('#tributeLastName').val()
                    },
                    Acknowledgee: {
                        FirstName: $('#acknowledgeeFirstName').val(),
                        LastName: $('#acknowledgeeLastName').val(),
                        AddressLines: $('#acknowledgeeAddress').val(),
                        City: $('#acknowledgeeCity').val(),
                        State: $('#acknowledgeeState').val(),
                        PostalCode: $('#acknowledgeeZip').val(),
                        Country: $('#acknowledgeeCountry option:selected').text().trim()
                    }
                };
            }

            // conditional for recurring
            if ($('#recurringGift').is(':checked')) {
                // field variables
                var frequency = $("#frequency").val(),
                    startDate = new Date($('#startDate').attr('data-date')),
                    endDate = new Date($('#endDate').val().replace(/-/g, '\/')),
                    dayOfMonth = startDate.getDate(),
                    month = startDate.getMonth() + 1;

                // monthly, quarterly, or annually
                if (frequency === '2') {
                    donation.Gift.Recurrence = {
                        DayOfMonth: dayOfMonth,
                        Frequency: 2,
                        StartDate: startDate,
                        EndDate: !!endDate ? endDate : '',
                        // ProcessNow: ADF.Methods.isProcessNow()
                    };
                } else if (frequency === '3') {
                    donation.Gift.Recurrence = {
                        DayOfMonth: dayOfMonth,
                        Frequency: 3,
                        StartDate: startDate,
                        EndDate: !!endDate ? endDate : '',
                        // ProcessNow: ADF.Methods.isProcessNow()
                    };
                } else if (frequency === '4') {
                    donation.Gift.Recurrence = {
                        DayOfMonth: dayOfMonth,
                        Month: month,
                        Frequency: 4,
                        StartDate: startDate,
                        EndDate: !!endDate ? endDate : '',
                        // ProcessNow: ADF.Methods.isProcessNow()
                    };
                }
            }

            // conditional for pledge installments
            if ($('#pledgeGift').is(':checked')) {
                donation.Origin.PageName = 'DPC Pledges';

                // field variables
                var frequency = $("#pledgeFrequency").val(),
                    // startDate = new Date($('#pledgeStartDate').attr('data-date')),
                    startDate = new Date($('#pledgeStartDate').val()),
                    // endDate = new Date($('#pledgeEndDate').val().replace(/-/g, '\/')),
                    endDate = '',
                    dayOfMonth = startDate.getDate(),
                    dayOfWeek = startDate.getDay(),
                    month = startDate.getMonth(); // + 1;

                // monthly, quarterly, or annually
                if (frequency === '1') {
                    // donation.Gift.Recurrence = {
                    //     DayOfMonth: dayOfMonth,
                    //     Frequency: 2,
                    //     StartDate: startDate,
                    //     EndDate: !!endDate ? endDate : '',
                    //     ProcessNow: ADF.Methods.isProcessNow()
                    // };
                } else if (frequency === '2') {
                    donation.Gift.Recurrence = {
                        DayOfMonth: dayOfMonth,
                        Frequency: 2,
                        StartDate: startDate,
                        EndDate: endDate,
                        // ProcessNow: ADF.Methods.isProcessNow()
                    };
                } else if (frequency === '3') {
                    donation.Gift.Recurrence = {
                        DayOfMonth: dayOfMonth,
                        Frequency: 3,
                        StartDate: startDate,
                        EndDate: endDate,
                        // ProcessNow: ADF.Methods.isProcessNow()
                    };
                } else if (frequency === '4') {
                    donation.Gift.Recurrence = {
                        DayOfMonth: dayOfMonth,
                        Month: month,
                        Frequency: 4,
                        StartDate: startDate,
                        EndDate: endDate,
                        // ProcessNow: ADF.Methods.isProcessNow()
                    };
                }

                // installment variables
                var numberOfInstallments = $('#pledgeInstallments').val(),
                    installmentAmount = $('.installment-amount').text().replace('$', '').replace(',', '');

                donation.Gift.PledgeInstallment = {
                    NumberOfInstallments: numberOfInstallments,
                    InstallmentAmount: installmentAmount
                };
            }

            // installment variables
            // var numberOfInstallments = $('#pledgeInstallments').val(),
            //     installmentAmount = $('#installmentAmount').val().replace('$', '').replace(',', '');
            //$('.installment-amount').text().replace('$', '').replace(',', '');

            // donation.Gift.PledgeInstallment = {
            //     NumberOfInstallments: numberOfInstallments,
            //     InstallmentAmount: installmentAmount
            // };

            // Do not start until existing/current pledge is completed.
            // if ($("input#startWhenCompleted").prop("checked") == true) {
            //     ADF.Defaults.doNotStartUntilExistingCompleted = "yes";
            // } else if ($("input#startWhenCompleted").prop("checked") == false) {
            //     ADF.Defaults.doNotStartUntilExistingCompleted = "no";
            // } else {}

            // Payroll Deduction Frequency (Monthly or Bi-Weekly)
            // ADF.Defaults.payrollDeductionFrequency = $("input[name='pay_period']:checked").val();

            var payrollDeductionFrequency = {
                AttributeId: ADF.Defaults.payrollDeductionFrequency,
                Value: $("input[name='pay_period']:checked").val()
            };
            donation.Gift.Attributes.push(payrollDeductionFrequency);


            if ($("#wantOrnament:checked").length !== 0) {
                // Want Ornament?
                var wantOrnament = {
                    AttributeId: ADF.Defaults.wantOrnament,
                    Value: "Yes"
                };
                donation.Gift.Attributes.push(wantOrnament);
            } else {
                var wantOrnament = {
                    AttributeId: ADF.Defaults.wantOrnament,
                    Value: "no"
                };
                donation.Gift.Attributes.push(wantOrnament);
            }

            if ($("#givingTuesdayAmbassador").val() != "") {
                var givingTuesdayAmbassador = {
                    AttributeId: ADF.Defaults.givingTuesdayAmbassador,
                    Value: $("#givingTuesdayAmbassador").val()
                };
                donation.Gift.Attributes.push(givingTuesdayAmbassador);
            }

            // Payroll Deduction M Number
            // ADF.Defaults.payrollDeductionMNumber = $("#employeeID").val();

            var payrollDeductionMNumber = {
                AttributeId: ADF.Defaults.payrollDeductionMNumber,
                Value: $("#employeeID").val()
            };
            donation.Gift.Attributes.push(payrollDeductionMNumber);

            // Payroll Deduction starts after current pledge
            if ($('input#startWhenCompleted').prop('checked')) {
                var pdStartAfterCurrentPledge = {
                    AttributeId: ADF.Defaults.pdStartAfterCurrentPledge,
                    Value: "Yes"
                };
                donation.Gift.Attributes.push(pdStartAfterCurrentPledge);
            }

            // Faculty & Staff Payroll Deduction Pledges 
            donation.Origin.PageName = 'Faculty & Staff Payroll Deduction Pledges';

            // field variables
            var frequency = $("#pledgeFrequency").val(),
                // startDate = new Date($('#pledgeStartDate').attr('data-date')),
                startDate = new Date($('#pledgeStartDate').val()),
                // endDate = new Date($('#pledgeEndDate').val().replace(/-/g, '\/')),
                endDate = '',
                dayOfMonth = startDate.getDate(),
                dayOfWeek = startDate.getDay(),
                month = startDate.getMonth(); // + 1;

            // monthly, quarterly, or annually
            if (frequency === '1') {
                // donation.Gift.Recurrence = {
                //     DayOfMonth: dayOfMonth,
                //     Frequency: 2,
                //     StartDate: startDate,
                //     EndDate: !!endDate ? endDate : '',
                //     ProcessNow: ADF.Methods.isProcessNow()
                // };
            } else if (frequency === '2') {
                donation.Gift.Recurrence = {
                    DayOfMonth: dayOfMonth,
                    Frequency: 2,
                    StartDate: startDate,
                    EndDate: endDate,
                    // ProcessNow: ADF.Methods.isProcessNow()
                };
            } else if (frequency === '3') {
                donation.Gift.Recurrence = {
                    DayOfMonth: dayOfMonth,
                    Frequency: 3,
                    StartDate: startDate,
                    EndDate: endDate,
                    // ProcessNow: ADF.Methods.isProcessNow()
                };
            } else if (frequency === '4') {
                donation.Gift.Recurrence = {
                    DayOfMonth: dayOfMonth,
                    Month: month,
                    Frequency: 4,
                    StartDate: startDate,
                    EndDate: endDate,
                    // ProcessNow: ADF.Methods.isProcessNow()
                };
            } else {
                // do nothing
            }

            // Employee ID / M Number 
            var employeeID = $("#employeeID").val();
            donation.Gift.Comments = "Employee ID/M Number: " + employeeID;

            // installment variables
            // var numberOfInstallments = parseInt($('#numberOfInstallments').val()),
            //     installmentAmount = $('#installmentAmount').val().replace('$', '').replace(',', '');

            // donation.Gift.PledgeInstallment = {
            //     NumberOfInstallments: numberOfInstallments,
            //     InstallmentAmount: installmentAmount
            // };

            var numberOfInstallments = parseInt($('#numberOfInstallments').val());
            if (numberOfInstallments) {
                var giftAmount = $("#totalGift").val().replace("$", "");

                //Amount has been hardcoded to 500. Replace the value with a value entered by user.
                var installmentAmount = donationService.getRecurringGiftInstallmentAmount(giftAmount, numberOfInstallments);

                donation.Gift.PledgeInstallment = {
                    NumberOfInstallments: numberOfInstallments,
                    InstallmentAmount: installmentAmount
                }
            }

            // Get frequency value
            var frequencyValue = $("#frequency").find("input[name='pay_period']:checked").val();
            console.log(frequencyValue);

            if (frequencyValue) {
                // The following fields are always required
                // donation.Gift.Recurrence = {
                // 	Frequency: $("#frequency").find("input[name='pay_period']:checked").val(),
                // 	StartDate: $('#startMonth').val(),
                // 	DayOfMonth: 1
                // };

                function dateNow(splinter) {
                    var set = new Date($('#startMonth').val());
                    var getDate = set.getDate().toString();
                    // if (getDate.length == 1) { //example if 1 change to 01
                    //     getDate = "0" + getDate;
                    // }
                    var getMonth = (set.getMonth() + 1).toString();
                    if (getMonth.length == 1) {
                        getMonth = "0" + getMonth;
                    }
                    var getYear = set.getFullYear().toString();
                    var dateNow = getMonth + splinter + getDate + splinter + getYear; //today
                    return dateNow;
                }

                // field variables
                var frequency = $("#frequency").find("input[name='pay_period']:checked").val(),
                    // startDate = new Date($('#pledgeStartDate').attr('data-date')),
                    startDate = new Date($('#startMonth').val()),
                    // endDate = new Date($('#pledgeEndDate').val().replace(/-/g, '\/')),
                    endDate = '',
                    dayOfMonth = startDate.getDate(),
                    dayOfWeek = startDate.getDay(),
                    month = startDate.getMonth() + 1,
                    year = startDate.getYear();

                var lastday = function(y, m) {
                    return new Date(y, m, 0).getDate();
                }

                var lastDayOfMonth = lastday(year, month);
                // year = year.split(" ")[1]
                console.log(dateNow("/"));

                var payrollDeductionStartDate = {
                    AttributeId: ADF.Defaults.payrollDeductionStartDate,
                    Value: dateNow("/")
                };
                donation.Gift.Attributes.push(payrollDeductionStartDate);

                /* monthly, quarterly, or annually */
                if (frequency) {
                    donation.Gift.Recurrence = {
                        DayOfMonth: 1, // lastDayOfMonth,
                        Frequency: 2,
                        StartDate: startDate,
                        EndDate: endDate,
                    };
                }
            }

            // donation.Gift.PledgeInstallment = {
            // 	NumberOfInstallments: numberOfInstallments,
            // 	InstallmentAmount: installmentAmount
            // };

            // conditional for bill me later
            // if ($('#billMeLater').is(':checked')) {
            //     donation.Gift.PaymentMethod = 1;
            // }

            // set bbsp return url (credit card)
            if (donation.Gift.PaymentMethod === 0) {
                // donation.BBSPReturnUri = window.location.href;
            }

            // if finder number is in URL (core BBIS functionality)
            if (!!ADF.Methods.returnQueryValueByName('efndnum')) {
                donation.Gift.FinderNumber = ADF.Methods.returnQueryValueByName('efndnum');
            }

            // if source code is in URL (core BBIS functionality)
            if (!!ADF.Methods.returnQueryValueByName('source')) {
                donation.Gift.SourceCode = ADF.Methods.returnQueryValueByName('source');
            }

            // if appeal id exists
            // if ($('#appeal').length !== 0 && !$('#appeal').is(':empty')) {
            //     donation.Gift.AppealId = $('#appeal').text();
            // }

            donation.Origin.AppealId = $("#companyName").val();

            donationSuccess = function(data) {
                // no action, automatically forwards to payment part
                // console.log(donation);
            };
            donationFail = function(d) {
                $(".BBFormValidatorSummary").html(
                    "<p>" + ADF.Methods.convertErrorsToHtml(d) + "</p>"
                );

                $("#adfSubmit")
                    .on("click", function(e) {
                        e.preventDefault();
                        // if (ADF.Methods.validateADF()) {
                        $(this)
                            .addClass("disabled")
                            .unbind("click");
                        // ADF.Methods.gf2SubmitADF();
                        ADF.Methods.getDonationData();
                        // }
                    })
                    .removeClass("disabled");
            };

            console.log(donation);

            donationService.createDonation(
                donation,
                donationSuccess,
                donationFail
            );

            // return donation object
            return donation;
        },

        // check equality of server date and (recurring or pledge installment gift) start date
        isProcessNow: function() {
            var frequency,
                startDate;

            if ($('#recurringGift').is(':checked')) {
                frequency = $("#frequency").val();
                startDate = new Date($('#startDate').attr('data-date'));
            } else if ($('#pledgeGift').is(':checked')) {
                frequency = $("#pledgeFrequency").val();
                startDate = new Date($('#pledgeStartDate').attr('data-date'));
            }

            var dayOfMonth = startDate.getDate(),
                month = startDate.getMonth() + 1,
                serverDate = ADF.Defaults.serverDate,
                recurrenceStartDate = startDate,
                startDateIsTodayDate = false,
                isProcessedNow = false;

            if (recurrenceStartDate.getFullYear() === serverDate.getFullYear() && recurrenceStartDate.getMonth() === serverDate.getMonth() && recurrenceStartDate.getDate() === serverDate.getDate()) {
                startDateIsTodayDate = true;
            } else {
                return false;
            }

            if (frequency === '2' || frequency === '3') {
                isProcessedNow = startDateIsTodayDate && dayOfMonth === serverDate.getDate();
            } else if (frequency === '4') {
                isProcessedNow = startDateIsTodayDate && dayOfMonth === serverDate.getDate() && month === serverDate.getMonth() + 1;
            } else {
                isProcessedNow = false;
            }

            return isProcessedNow;
        },

        // api error handling
        convertErrorToString: function(error) {
            if (error) {
                if (error.Message)
                    return error.Message;
                switch (error.ErrorCode) {
                    case 101:
                        if (true) {
                            return error.Field + ' is required.';
                        }
                        break;
                    case 102:
                        if (true) {
                            return error.Field + ' is invalid.';
                        }
                        break;
                    case 103:
                        if (true) {
                            return error.Field + ' is below minimum.';
                        }
                        break;
                    case 104:
                        if (true) {
                            return error.Field + ' exceeds maximum.';
                        }
                        break;
                    case 105:
                        if (true) {
                            return error.Field + ' is not allowed.';
                        }
                        break;
                    case 106:
                        if (true) {
                            return 'Record for ' + error.Field + ' was not found.';
                        }
                        break;
                    case 107:
                        if (true) {
                            return 'Max length for ' + error.Field + ' exceeded.';
                        }
                        break;
                    case 203:
                        if (true) {
                            return 'Your donation was not completed and your credit card has not been charged. Please try again later.';
                        }
                        break;
                    default:
                        return 'Error code ' + error.ErrorCode + '.';
                }
            }
        },

        // convert errors to html
        convertErrorsToHtml: function(errors) {
            // process error
            var i, message = 'Unknown error.<br/>';
            if (errors) {
                message = '';
                for (i = 0; i < errors.length; i++) {
                    message = message + ADF.Methods.convertErrorToString(errors[i]) + '<br/>';
                }
            }
            return message;
        },

        // gift options
        giftOptions: function() {
            // field variables
            var onetimeGift = $('#onetimeGift'),
                recurringGift = $('#recurringGift'),
                recurringGiftSection = $('#recurringGiftSection'),
                startDate = $('#startDate'),
                endingDate = $('#endingDate'),
                pledgeGift = $('#pledgeGift'),
                pledgeGiftSection = $('#pledgeGiftSection'),
                tributeGift = $('#tributeGift'),
                honoreeSection = $('#honoreeSection'),
                acknowledgeeLetter = $('#ackLetter'),
                acknowledgeeSection = $('#acknowledgeeSection'),
                matchingGift = $('#matchingGift'),
                matchingGiftSection = $('#matchingGiftSection'),
                corpGift = $('#corporateGift'),
                corpGiftSection = $('#corporateGiftSection');

            // one-time gift selection
            onetimeGift.on('change', function() {
                if (recurringGift.is(':checked')) {
                    recurringGift.click();
                }
                if (pledgeGift.is(':checked')) {
                    pledgeGift.click();
                }
            });

            // recurring gift selection
            startDate.on('change', function() {
                $('#startDate').attr('data-date', $(this).val());
            });

            // recurring gift selection
            recurringGift.on('change', function() {
                if ($(this).is(':checked')) {
                    // show recurring gift fields
                    recurringGiftSection.removeClass('hidden');

                    // hide pledge gift checkbox
                    // pledgeGift.parent().addClass('hidden');

                    // uncheck one-time gift checkbox if checked
                    if (onetimeGift.is(':checked')) {
                        onetimeGift.click();
                    }

                    // uncheck pledge gift checkbox if checked
                    if (pledgeGift.is(':checked')) {
                        pledgeGift.click();
                    }

                    // hide tribute checkbox
                    tributeGift.parent().addClass('hidden');

                    // uncheck tribute checkbox if checked
                    if (tributeGift.is(':checked')) {
                        tributeGift.click();
                    }

                    // uncheck acknowledgee checkbox if checked
                    if (acknowledgeeLetter.is(':checked')) {
                        acknowledgeeLetter.click();
                    }
                } else {
                    // hide recurring gift fields
                    recurringGiftSection.addClass('hidden');

                    // show pledge gift checkbox
                    pledgeGift.parent().removeClass('hidden');

                    // show tribute checkbox
                    tributeGift.parent().removeClass('hidden');
                }

                // toggle ending date section
                if (endingDate.is(':checked') && !$(this).is(':checked')) {
                    endingDate.click();
                }
            });

            // optional end date selection
            endingDate.on('change', function() {
                if ($(this).is(':checked')) {
                    $(this).closest('.row').next('.row').removeClass('hidden');
                } else {
                    $(this).closest('.row').next('.row').addClass('hidden');
                }
            });

            // pledge gift selection
            pledgeGift.on('change', function() {
                if ($(this).is(':checked')) {
                    // show pledge gift fields
                    pledgeGiftSection.removeClass('hidden');

                    // hide recurring checkbox
                    // recurringGift.parent().addClass('hidden');

                    // uncheck one-time gift checkbox if checked
                    if (onetimeGift.is(':checked')) {
                        onetimeGift.click();
                    }

                    // uncheck recurring checkbox if checked
                    if (recurringGift.is(':checked')) {
                        recurringGift.click();
                    }

                    // uncheck acknowledgee checkbox if checked
                    if (acknowledgeeLetter.is(':checked')) {
                        acknowledgeeLetter.click();
                    }

                    // hide tribute checkbox
                    tributeGift.parent().addClass('hidden');

                    // uncheck tribute checkbox if checked
                    if (tributeGift.is(':checked')) {
                        tributeGift.click();
                    }
                } else {
                    // hide pledge gift fields
                    pledgeGiftSection.addClass('hidden');

                    // show recurring checkbox
                    recurringGift.parent().removeClass('hidden');

                    // show tribute checkbox
                    tributeGift.parent().removeClass('hidden');
                }
            });

            // tribute selection
            tributeGift.on('change', function() {
                if ($(this).is(':checked')) {
                    // show honoree section
                    honoreeSection.removeClass('hidden');

                    // hide recurring gift section
                    recurringGiftSection.addClass('hidden');
                    recurringGift.parent().addClass('hidden');

                    // hide pledge gift section
                    pledgeGiftSection.addClass('hidden');
                    pledgeGift.parent().addClass('hidden');
                } else {
                    // hide honoree and acknowledgee sections
                    honoreeSection.addClass('hidden');
                    acknowledgeeSection.addClass('hidden');

                    // show recurring gift checkbox
                    recurringGift.parent().removeClass('hidden');

                    // show pledge gift checkbox
                    pledgeGift.parent().removeClass('hidden');
                }

                // toggle acknowledgee section
                if (acknowledgeeLetter.is(':checked') && !$(this).is(':checked')) {
                    acknowledgeeLetter.click();
                }
            });

            // acknowledgee selection
            acknowledgeeLetter.on('change', function() {
                if ($(this).is(':checked')) {
                    // show acknowledgee section
                    acknowledgeeSection.removeClass('hidden');
                } else {
                    // hide acknowledgee section
                    acknowledgeeSection.addClass('hidden');
                }
            });

            // matching gift selection
            matchingGift.on('change', function() {
                if ($(this).is(':checked')) {
                    // show matching gift section
                    matchingGiftSection.removeClass('hidden');

                    // hide corporate gift checkbox
                    corpGift.parent().addClass('hidden');
                } else {
                    // hide matching gift section
                    matchingGiftSection.addClass('hidden');

                    // show corporate gift checkbox
                    corpGift.parent().removeClass('hidden');
                }
            });

            // corporate gift selection
            corpGift.on('change', function() {
                if ($(this).is(':checked')) {
                    // show company name section
                    corpGiftSection.removeClass('hidden');

                    // hide matching gift checkbox
                    matchingGift.parent().addClass('hidden');

                    // uncheck matching gift checkbox if checked
                    if (matchingGift.is(':checked')) {
                        matchingGift.click();
                    }
                } else {
                    // hide company name section
                    corpGiftSection.addClass('hidden');

                    // show matching gift checkbox
                    matchingGift.parent().removeClass('hidden');
                }
            });
        },

        // processing fee
        // procFee: function() {
        //     // fund card
        //     var pf = $('.fund-card.proc-fee');

        //     // toggle transaction fee
        //     $('#processingFee').on('click', function() {
        //         // toggle visibility
        //         pf.toggleClass('hidden');

        //         // update total amount
        //         ADF.Methods.updateTotal();

        //         // update pledge summary
        //         if ($('#pledgeGift').is(':checked')) {
        //             ADF.Methods.pledgeSummary();
        //         }
        //     });

        //     // remove transaction fee
        //     pf.find('.remove-fee').on('click', function(e) {
        //         e.preventDefault();
        //         $('#processingFee').click();
        //     });
        // },

        // get countries and states
        populateCountryDropdowns: function() {
            var countryService = new BLACKBAUD.api.CountryService({
                url: ADF.Defaults.rootpath,
                crossDomain: false,
            });
            countryService.getCountries(function(country) {
                $.each(country, function() {
                    $("#acknowledgeeCountry").append(
                        $("<option></option>")
                        .val(this["Abbreviation"])
                        .text(this["Description"])
                        .attr("id", this["Id"])
                    );
                });
                ADF.Methods.populateStateDropdowns(
                    $("#acknowledgeeCountry")
                    .find('[value="USA"]')
                    .attr("id")
                );
                $("#acknowledgeeCountry")
                    .val("USA")
                    .on("change", function() {
                        var countryID = $(this)
                            .find(":selected")
                            .attr("id");
                        ADF.Methods.populateStateDropdowns(countryID);
                    });
            });
        },
        populateStateDropdowns: function(countryID) {
            var countryService = new BLACKBAUD.api.CountryService({
                url: ADF.Defaults.rootpath,
                crossDomain: false,
            });
            countryService.getStates(countryID, function(state) {
                $("#acknowledgeeState option:gt(0)").remove();
                $.each(state, function() {
                    $("#acknowledgeeState").append(
                        $("<option></option>")
                        .val(this["Abbreviation"])
                        .text(this["Description"])
                    );
                });
            });
        },

        getCountryState: function() {
            var selectDonorCountry = $('#personalCountry'),
                selectDonorState = $('#personalState'),
                selectAckCountry = $('#acknowledgeeCountry'),
                selectAckState = $('#acknowledgeeState');

            // load countries
            // $.get(ADF.Defaults.rootPath + 'webapi/country', function(countries) {
            //     for (var i = 0, j = countries.length; i < j; i++) {
            //         selectDonorCountry.append('<option value="' + countries[i].Id + '">' + countries[i].Description + '</option>');
            //         selectAckCountry.append('<option value="' + countries[i].Id + '">' + countries[i].Description + '</option>');
            //     }
            // }).done(function() {
            //     // default country (United States)
            //     selectDonorCountry.val(ADF.Defaults.defaultCountry).change();
            //     selectAckCountry.val(ADF.Defaults.defaultCountry).change();
            // });

            // watch country change (donor)
            // selectDonorCountry.on('change', function() {
            // load states
            // $.get(ADF.Defaults.rootPath + 'webapi/country/' + $(this).val() + '/state', function (states)
            $.get(ADF.Defaults.rootPath + 'webapi/country/' + ADF.Defaults.defaultCountry + '/state', function(states) {

                selectDonorState.html('');
                for (var i = 0, j = states.length; i < j; i++) {
                    selectDonorState.append('<option value="' + states[i].Abbreviation + '">' + states[i].Description + '</option>');
                }
                selectDonorState.prepend('<option value="-1">State/Territory</option>').val('-1');
            }).done(function() {
                if (selectDonorState.find('option').length < 2) {
                    selectDonorState.removeAttr('required').removeClass('required');
                    selectDonorState.siblings('.marker').hide();
                } else {
                    selectDonorState.prop('required', true).addClass('required');
                    selectDonorState.siblings('.marker').show();
                }
            });
            // });

            // watch country change (acknowledgee)
            selectAckCountry.on('change', function() {
                // load states
                $.get(ADF.Defaults.rootPath + 'webapi/country/' + $(this).val() + '/state', function(states) {
                    selectAckState.html('');
                    for (var i = 0, j = states.length; i < j; i++) {
                        selectAckState.append('<option value="' + states[i].Abbreviation + '">' + states[i].Description + '</option>');
                    }
                    selectAckState.prepend('<option value="-1">State/Territory</option>').val('-1');
                }).done(function() {
                    if (selectAckState.find('option').length < 2) {
                        selectAckState.removeAttr('required').removeClass('required');
                        selectAckState.siblings('.marker').hide();
                    } else {
                        selectAckState.prop('required', true).addClass('required');
                        selectAckState.siblings('.marker').show();
                    }
                });
            });
        },

        // get title table
        getTitle: function() {
            var donorTitle = $('#personalTitle');

            $.get(ADF.Defaults.rootPath + 'webapi/CodeTable/' + ADF.Defaults.titleTable, function(data) {
                for (var i = 0, j = data.length; i < j; i++) {
                    donorTitle.append('<option value="' + data[i].Id + '">' + data[i].Description + '</option>');
                }
            }).done(function() {
                donorTitle.val('-1').change();
            });
        },

        // date picker behavior
        datePicker: function() {
            // today's date
            var date = new Date(),
                today = date.toLocaleDateString('en-US', {
                    month: '2-digit',
                    day: '2-digit',
                    year: 'numeric'
                }).replace(/\u200E/g, '');

            if ($('html').hasClass('-ms-')) {
                // $('#startDate').val(today);
                $('#pledgeStartDate').val(today);
            } else {
                // $('#startDate').val(new Date(today).toISOString().substring(0, 10));
                $('#pledgeStartDate').val(new Date(today).toISOString().substring(0, 10));
            }

            // normalized date attribute
            // $('#startDate').attr('data-date', today);
            $('#pledgeStartDate').attr('data-date', today);

            if ($("#startDate").length !== 0) {
                var d = new Date(),
                    day = d.getDate();

                function getMinDate() {
                    var date = new Date();
                    if (day > 15) {
                        date.setMonth(date.getMonth() + 1, 1);
                    } else if (day == 1) {
                        // set to current date
                    } else {
                        date.setDate(15);
                    }
                    return date;
                }
                $("#startDate").datepicker({
                    beforeShowDay: function(dt) {
                        return [
                            dt.getDate() == 1 || dt.getDate() == 15 ?
                            true :
                            false,
                        ];
                    },
                    minDate: getMinDate(),
                });
                $("#startDate").datepicker("setDate", getMinDate()).attr('data-date', getMinDate());

                $("#endDate").datepicker({
                    minDate: getMinDate()
                });
            }
        },

        // calculate installments
        calculateInstallments: function() {
            // run on all field events
            $('#numberOfInstallments').add('#pledgeFrequency').add('#pledgeStartDate').on('change keyup focusout input paste', function() {
                // ADF.Methods.pledgeSummary();
            });
        },

        // URL query parameters
        queryParameters: function() {
            // if finder number is in URL (core BBIS functionality)
            if (!!ADF.Methods.returnQueryValueByName('efndnum')) {
                let finderNumber = ADF.Methods.returnQueryValueByName('efndnum');
                $("#finderNumber").val(finderNumber);
            }

            // character counter (comments)
            $('#comments').limit('#comments + .char-counter span');

            const capitalize = (s) => {
                if (typeof s !== 'string') return ''
                return s.charAt(0).toUpperCase() + s.slice(1)
            }

            if (!!ADF.Methods.returnQueryValueByName('fname')) {
                $('#personalFirstName').val(capitalize(ADF.Methods.returnQueryValueByName('fname')));
            }

            if (!!ADF.Methods.returnQueryValueByName('lname')) {
                $('#personalLastName').val(capitalize(ADF.Methods.returnQueryValueByName('lname')));
            }

            if (!!ADF.Methods.returnQueryValueByName('adr')) {
                $('#personalAddress').val(ADF.Methods.returnQueryValueByName('adr'));
            }

            if (!!ADF.Methods.returnQueryValueByName('adrtp')) {
                $('#personalAddressType option:selected').text(capitalize(ADF.Methods.returnQueryValueByName('adrtp')));
            }

            if (!!ADF.Methods.returnQueryValueByName('cty')) {
                $('#personalCity').val(capitalize(ADF.Methods.returnQueryValueByName('cty')));
            }

            if (!!ADF.Methods.returnQueryValueByName('st')) {
                $('#personalState').val(ADF.Methods.returnQueryValueByName('st').toUpperCase());
            }

            if (!!ADF.Methods.returnQueryValueByName('zp')) {
                $('#personalZip').val(ADF.Methods.returnQueryValueByName('zp'));
            }

            if (!!ADF.Methods.returnQueryValueByName('eml')) {
                $('#personalEmail').val(ADF.Methods.returnQueryValueByName('eml'));
            }

            if (!!ADF.Methods.returnQueryValueByName('emltp')) {
                $('#personalEmailType option:selected').text(capitalize(ADF.Methods.returnQueryValueByName('emltp')));
            }

            // if finder number is in URL (core BBIS functionality)
            // if (!!ADF.Methods.returnQueryValueByName('solicitor')) {
            //     $('#solicitorCode').val(ADF.Methods.returnQueryValueByName('solicitor'));
            // }
        },

        // pledge summary
        pledgeSummary: function() {
            // pledge installment helper function variables
            // var totalGiftAmount = $('.total-amount span').text().replace('$', '').replace(',', ''),
            // 	numberOfInstallments = $('#pledgeInstallments').val(),
            // 	frequencyCode = "2",
            // 	// frequencyCode = $('#pledgeFrequency').val(),
            // 	installmentStartDate = new Date($('#pledgeStartDate').attr('data-date')),
            // 	installmentDayOfMonth = installmentStartDate.getDate(),
            // 	installmentMonth = installmentStartDate.getMonth() + 1;

            // // pledge summary logic
            // if ($('.fund-card.empty').hasClass('hidden') && $('#pledgeFrequency').val() !== '-1' && $('#pledgeInstallments').val() !== '' && $('.min-amount').length === 0) {
            // 	// payment info variables
            // 	var pledgeInstallmentValue = $('#pledgeInstallments').val();
            // 	if (pledgeInstallmentValue == '1') {

            // 		var GiftLastPaymentDate = $('#pledgeStartDate').attr('data-date'),
            // 			GiftInstallmentAmount = donationService.getRecurringGiftInstallmentAmount(totalGiftAmount, numberOfInstallments);

            // 	} else {

            // 		var GiftLastPaymentDate = donationService.getRecurringGiftLastPaymentDate(numberOfInstallments, frequencyCode, installmentStartDate, installmentMonth, installmentDayOfMonth).toLocaleDateString('en-US', {
            // 			month: '2-digit',
            // 			day: '2-digit',
            // 			year: 'numeric'
            // 		}),
            // 			GiftInstallmentAmount = donationService.getRecurringGiftInstallmentAmount(totalGiftAmount, numberOfInstallments);

            // 	}
            // 	// convert currency format
            // 	var formatter = new Intl.NumberFormat('en-US', {
            // 		style: 'currency',
            // 		currency: 'USD',
            // 	}),
            // 		formattedInstallmentAmount = formatter.format(GiftInstallmentAmount);

            // 	// pledge summary content variable
            // 	if (pledgeInstallmentValue == '1') {
            // 		$('#pledgeEndDate').val(installmentStartDate);

            // 		var pledgeSummary = numberOfInstallments + ' installments of <span class="installment-amount">' + formattedInstallmentAmount + '</span> ' + $('#pledgeFrequency option:selected').text().toLowerCase() + 'on ' + $('#pledgeStartDate').val();
            // 	} else {
            // 		var pledgeSummary = numberOfInstallments + ' installments of <span class="installment-amount">' + formattedInstallmentAmount + '</span> ' + $('#pledgeFrequency option:selected').text().toLowerCase() + 'until ' + GiftLastPaymentDate;
            // 	}
            // 	// var pledgeSummary = numberOfInstallments + ' installments of <span class="installment-amount">' + formattedInstallmentAmount + '</span> ' + $('#pledgeFrequency option:selected').text().toLowerCase() + 'until ' + GiftLastPaymentDate;

            // 	// set pledge installment end date
            // 	if ($('html').hasClass('-ms-')) {
            // 		$('#pledgeEndDate').val(GiftLastPaymentDate);
            // 	} else {
            // 		if (pledgeInstallmentValue == '1') {
            // 			$('#pledgeEndDate').val($('#pledgeStartDate').val());
            // 		} else {
            // 			$('#pledgeEndDate').val(new Date(GiftLastPaymentDate).toISOString().substring(0, 10));
            // 		}

            // 		// $('#pledgeEndDate').val(new Date(GiftLastPaymentDate).toISOString().substring(0, 10));
            // 	}

            // 	// show pledge summary
            // 	$('#pledgeSummary').show().find('p').html(pledgeSummary);
            // } else {
            // 	// reset pledge installment end date
            // 	$('#pledgeEndDate').val('');

            // 	// hide pledge summary
            // 	$('#pledgeSummary').hide();
            // }
        }
    }
};

// create new instance of donation service (global)
var donationService = new BLACKBAUD.api.DonationService(ADF.Defaults.partId);

// run scripts
ADF.Methods.pageInit();

// character counter
(function($) {
    $.fn.extend({
        limit: function(element) {
            var self = $(this),
                limit = self.attr('maxlength');
            self.keyup(function() {
                var length = self.val().length;
                var count = limit - length;
                $(element).text(count);
            });
        }
    });
})(jQuery);

// invalid expression matcher (form validation)
jQuery.extend(jQuery.expr[':'], {
    invalid: function(elem, index, match) {
        var invalids = document.querySelectorAll(':invalid'),
            result = false,
            len = invalids.length;

        if (len) {
            for (var i = 0; i < len; i++) {
                if (elem === invalids[i]) {
                    result = true;
                    break;
                }
            }
        }
        return result;
    }
});

// add focus styling to the parent (li) element of the radio button receiving focus
function parentFocus(event) {
    // get event object if using internet explorer
    var e = event || window.event;

    // check the object for w3c dom event object, if not use ie event object to update the class of the parent element
    if (e.target) {
        e.target.parentNode.classList.add('focus');
    } else {
        e.srcElement.parentNode.classList.add('focus');
    }
}

// remove focus styling from the parent (li) element of the radio button receiving focus
function parentBlur(event) {
    // get event object if using internet explorer
    var e = event || window.event,
        node;

    // check the object for w3c dom event object, if not use ie event object to update the class of the parent element
    if (e.target) {
        e.target.parentNode.classList.remove('focus');
    } else {
        e.srcElement.parentNode.classList.remove('focus');
    }
}

function checkboxPressed(event) {
    // This function is fired by the onclick function of the fund checkboxes
    // Onclick will handle standard keyboard input (spacebar) and mouse click
    // as well as function while a screen reader is present.

    // Get the event that was fired
    var e = event || window.event,
        node;


    // Get the label for the input that was checked. This is needed
    // to pass to the addFund function later on
    var choice = $(e.target).labels().first();

    // Since we are hidding the standard html checkbox and showing
    // pretty css divisions, we need to handle checking and unchecking the
    // checkbox. The $(e.target).click(); is not working so we will manually
    // set all of the appropriate properties and attributes

    // If the box is already checked, uncheck it and set the parent division's
    // aria-checked attribute to false. Then call the removeFund method
    // for the checkbox's ID
    if ($(e.target).prop("checked") == false) {
        $(e.target).prop(":checked", false);
        $(e.target.parentElement).attr("aria-checked", false);
        var id = $(e.target).attr('id');
        ADF.Methods.removeFund(id);

    }

    // Otherwise, set the checkbox to checked, and the aria-checked attribute to true
    // and call the addFund using the checkbox's label element
    else {
        $(e.target).prop(":checked", true);
        $(e.target.parentElement).attr("aria-checked", true);
        ADF.Methods.addFund($(choice));
    }

}

$("#fundSelect").on('change', function(e) {
    ADF.Methods.addFund($(this));
});
