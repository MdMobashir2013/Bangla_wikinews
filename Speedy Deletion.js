//BY [[USER:Tanbiruzzaman]]
//বাংলা উইকিসংবাদে এক ক্লিকে দ্রুত অপসারণের ট্যাগ করার জন্য এই স্ক্রিপ্ট
//বাংলা উইকিসংবাদের বাইরে এটি সঠিক ফলাফল দিবেনা
//<nowiki>
if (mw.config.get("wgNamespaceNumber") >= 0 && mw.config.get("wgIsProbablyEditable")) {
	var QuickDelete = {};
	$(document).ready(function() {
		QuickDelete.addReason = function(reason, tag) {
			QuickDelete.reasons.push([tag, reason]);
			//QuickDelete.tag[reason] = tag;
		};
		QuickDelete.delete = function(reason, tag) {
			console.log("Getting token...");
			$.get(mw.config.get("wgScriptPath") + "/api.php", {
				"action": "query",
				"meta": "tokens",
				"type": "csrf",
				"format": "json"
			}).done(function(token) {
				if (token.error) {
					mw.notify($("<span class=\"error\">" + token.error.info + "</span>"));
				} else {
					var temp = tag.substring(3, 6);
					if (temp.toLowerCase() != "st:" && temp.toLowerCase() != "c1") {
						$.post(mw.config.get("wgScriptPath") + '/api.php', {
							"action": "delete",
							"format": "json",
							"title": mw.config.get("wgPageName"),
							"reason": reason + " ([[User:Tanbiruzzaman/Wn/bn/দ্রুত অপসারণ.js|Wn/bn/দ্রুত অপসারণ স্ক্রিপ্ট]])",
							"token": token.query.tokens.csrftoken
						}).done(function(editresult) {
							if (editresult.error) {
								mw.notify($("<span class=\"error\">" + editresult.error.info + "</span>"));
							} else {
								location.href = "/wiki/" + mw.config.get("wgPageName");
							}
						}).fail(function(editresult) {
							mw.notify("<span class=\"error\">" + editresult + "</span>");
						});
					} else {
						QuickDelete.addTag(tag);
					}
				}
				
			}).fail(function(token) {
				mw.notify($("<span class=\"error\">" + token + "</span>"));
			});

		};
		QuickDelete.addTag = function(reason) {
			if (reason) {
				console.log("Getting wikitext...");
				$.get(mw.config.get("wgScriptPath") + "/api.php", {
					"action": "parse",
					"prop": "wikitext",
					"page": mw.config.get("wgPageName"),
					"format": "json"
				}).done(function(result) {
					if (result.error) {
						mw.notify($("<span class=\"error\">" + result.error.info + "</span>"));
					} else if (result.parse.wikitext["*"].toLowerCase().substring(0, 100).includes("{{অপসারণ") || result.parse.wikitext["*"].toLowerCase().substring(0, 100).includes("{{অপসারণ")) {
						mw.notify($("<span class=\"error\">" + "পাতাটি দ্রুত অপসারণ প্রস্তাবনা ইতোমধ্যে দেওয়া হয়েছে।" + "</span>"));
					} else {
						console.log("Getting token...");
						$.get(mw.config.get("wgScriptPath") + "/api.php", {
							"action": "query",
							"meta": "tokens",
							"type": "csrf",
							"format": "json"
						}).done(function(token) {
							if (token.error) {
								mw.notify($("<span class=\"error\">" + token.error.info + "</span>"));
							} else {
								console.log("Building wikitext and saving...");
								var newwikitext = result.parse.wikitext["*"];
								if (reason == "db-g10") {
									newwikitext = "<noinclude>{{" + reason + "}}</noinclude>";
								} else {
									if (reason != "subst:void") {
										newwikitext = "<noinclude>{{" + reason + "}}</noinclude>" + newwikitext;
									} else {
										newwikitext = "{{" + reason + "}}" + newwikitext;
									}
								}
								$.post(mw.config.get("wgScriptPath") + '/api.php', {
									"action": "edit",
									"format": "json",
									"title": mw.config.get("wgPageName"),
									"text": newwikitext,
									"summary": "Adding {{" + reason + "}} ([[User:Tanbiruzzaman/Wn/bn/দ্রুত অপসারণ.js|Wn/bn/দ্রুত অপসারণ]])",
									"token": token.query.tokens.csrftoken
								}).done(function(editresult) {
									if (editresult.error) {
										mw.notify($("<span class=\"error\">" + editresult.error.info + "</span>"));
									} else {
										location.href = "/wiki/" + mw.config.get("wgPageName");
									}
								}).fail(function(editresult) {
									mw.notify("<span class=\"error\">" + editresult + "</span>");
								});
							}
							
						}).fail(function(token) {
							mw.notify($("<span class=\"error\">" + token + "</span>"));
						});
					}
				}).fail(function(result) {
					mw.notify($("<span class=\"error\">" + result + "</span>"));
				});
			}
		};
		QuickDelete.select = $('<select name="deletiontemplate" style="width:100px" id="qcsd-dropdown" class="mw-ui-input"/>');
		QuickDelete.el = $('<div class="mw-indicator"><form id="qcsd"></form></div>');
		$.get(mw.config.get("wgScriptPath") + "/api.php", {
			"action": "parse",
			"prop": "wikitext",
			"format": "json",
			"page": mw.config.get("wgPageName")
		}).done(function(result) {
			if (!result.error) {
				// reasons begin
				QuickDelete.reasons = [];
				// মূল নামস্থানের পাতাসমূহ
				QuickDelete.addReason("নিবন্ধ", "-");
				QuickDelete.addReason("[[Wn/bn/WN:CSD#নি১|দ্রুত নি১]]: কোন অর্থপূর্ণ বিষয়বস্তু বা ইতিহাস নেই", "Wn/bn/অপসারণ|নি১");
				if (mw.config.get("wgNamespaceNumber") == 0) {
					QuickDelete.addReason("[[Wn/bn/WN:CSD#নি২|দ্রুত নি২]]: পরীক্ষামূলক পাতা", "Wn/bn/অপসারণ|নি২");
				}
				QuickDelete.addReason("[[Wn/bn/WN:CSD#নি৩|দ্রুত নি৩]]: স্পষ্ট ধ্বংসপ্রবণতা", "Wn/bn/অপসারণ|নি৩");
				QuickDelete.addReason("[[Wn/bn/WN:CSD#নি৪|দ্রুত নি৪]]: অপ্রাসঙ্গিক খুব ছোট নিবন্ধ", "Wn/bn/অপসারণ|নি৪");
				QuickDelete.addReason("[[Wn/bn/WN:CSD#নি৫|দ্রুত নি৫]]: /প্রতিলিপি স্থানান্তর পরিষ্কারকরণ", "Wn/bn/অপসারণ|নি৫");
				QuickDelete.addReason("[[Wn/bn/WN:CSD#নি৬|দ্রুত নি৬]]: বিজ্ঞাপন/প্রচারণা বা স্প্যাম", "Wn/bn/অপসারণ|নি৬");
				QuickDelete.addReason("[[Wn/bn/WN:CSD#নি৭|দ্রুত নি৭]]: কোন অর্থপূর্ণ বিষয়বস্তু বা ইতিহাস নেই", "Wn/bn/অপসারণ|নি৭");
				QuickDelete.addReason("[[Wn/bn/WN:CSD#নি৮|দ্রুত নি৮]]: সুস্পষ্ট প্রতারণা বা কথাসাহিত্যের অন্যান্য কাজ", "Wn/bn/অপসারণ|নি৮");
				QuickDelete.addReason("[[Wn/bn/WN:CSD#নি৯|দ্রুত নি৯]]: অপসারিত পাতা পুনরায় তৈরি", "Wn/bn/অপসারণ|নি৯");
				QuickDelete.addReason("[[Wn/bn/WN:CSD#নি১০|দ্রুত নি১০]]: নিবন্ধটি বাংলায় লিখিত নয়", "Wn/bn/অপসারণ|নি১০");
				QuickDelete.addReason("[[Wn/bn/WN:CSD#নি১১|দ্রুত নি১১]]: স্পষ্টত কপিরাইট লঙ্ঘন।", "Wn/bn/অপসারণ|নি১১");
				QuickDelete.addReason("[[Wn/bn/WN:CSD#নি১২|দ্রুত নি১২]]: প্রকল্পের লক্ষ্য বহির্ভূত", "Wn/bn/অপসারণ|নি১২");

				if (result.parse.wikitext["*"].toLowerCase().substring(0, "#redirect".length).match(/.*\#redirect.*/g)) {
					// redirect
					QuickDelete.addReason("পুনর্নির্দেশ", "-");
					QuickDelete.addReason('[[Wn/bn/WN:CSD#প১|দ্রুত প১]]: অস্তিত্বহীন পাতায় পুনর্নির্দেশ', 'Wn/bn/অপসারণ|প১');
					QuickDelete.addReason('[[Wn/bn/WN:CSD#প২|দ্রুত প২]]: অদমিত পুনর্নির্দেশ', 'Wn/bn/অপসারণ|প২');
					QuickDelete.addReason('[[Wn/bn/WN:CSD#প৩|দ্রুত প৩]]: শিরোনামে বানানগত ত্রুটির ফলে হওয়া পুনঃনির্দেশ', 'Wn/bn/অপসারণ|প৩');
					QuickDelete.addReason('[[Wn/bn/WN:CSD#প৪|দ্রুত প৪]]: স্থানান্তর ধ্বংসপ্রবণতার ফলে তৈরি পুনঃনির্দেশ', 'Wn/bn/অপসারণ|প৪');
				} else {

						// অন্যান্য পাতার জন্য, সাধারণ বিচারধারা
						QuickDelete.addReason("অন্য পাতা", "-");
						QuickDelete.addReason('[[Wn/bn/WN:CSD#স১|দ্রুত স১]]: ব্যবহারকারী পাতা মুছে ফেলতে ব্যবহারকারীর অনুরোধ', 'Wn/bn/অপসারণ|স১');
						QuickDelete.addReason('[[Wn/bn/WN:CSD#স২|দ্রুত স২]]: অপসারিত নিবন্ধের আলাপ পাতা', 'Wn/bn/অপসারণ|স২');
						QuickDelete.addReason('[[Wn/bn/WN:CSD#স৩|দ্রুত স৩]]: বেনামী ব্যবহারকারীর আর প্রাসঙ্গিক আলাপ পাতা নেই', 'Wn/bn/অপসারণ|স৩');
						QuickDelete.addReason('[[Wn/bn/WN:CSD#স৪|দ্রুত স৪]]: ফাঁকা বিষয়শ্রেণী', 'Wn/bn/অপসারণ|স৪');
						QuickDelete.addReason('[[Wn/bn/WN:CSD#স৫|দ্রুত স৫]]: ব্যবহারকারীর অনুরোধে ব্যবহারকারী পাতা অপসারণ', 'Wn/bn/অপসারণ|স৫');
						QuickDelete.addReason('[[Wn/bn/WN:CSD#স৬|দ্রুত স৬]]: অপ্রকাশিত নিবন্ধের মন্তব্য পাতা', 'Wn/bn/অপসারণ|স৬');
				}
				QuickDelete.select.append($('<option />').prop('disabled', true).prop('selected', true).text("OCD..."));
				QuickDelete.select.append($('<option />').attr('value', 'subst:void').text("Cancel"));
				QuickDelete.select.change(function(e) {
					//debugger;
					QuickDelete.select.prop("disabled", true);
					if (mw.config.get("wgUserGroups").includes("test-sysop")) {
						QuickDelete.delete($("#qcsd-dropdown option:selected").text(), $("#qcsd-dropdown").val());
					} else {
						QuickDelete.addTag($("#qcsd-dropdown").val());
					}
				});
				QuickDelete.reasons.forEach(function(r) {
					if (r[0] == "-") {
						QuickDelete.select.append($('<option />').prop('disabled', true).text(r[1]));
					} else {
						QuickDelete.select.append($('<option />').attr('value', r[0]).text("\xA0\xA0" + r[1]));
					}
				});
			
				QuickDelete.el.appendTo("#siteNotice");
				if (mw.config.get("skin") != "minerva") {
					QuickDelete.el.css({"float": "right", "margin-left": "10px"});
				}
				QuickDelete.select.appendTo("#qcsd");
			}
		}).fail(function(result) {
			
		});
	});
}
//</nowiki>
