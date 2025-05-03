//By [[User:Asked42]]
// <nowiki>

/**
* WikiDialog - Qucik action functionalities for Bengali Wikinews
* @version 2.0
* 
* A user interface script that provides quick action buttons and menu items for common Wikinews tasks.
* Currently supports three main actions:
* - "Submit for Review": Submits an article for peer review
* - "Self Publish": Publishes an article with appropriate templates
* - "Archive": Marks an article as archived
* 
* Features:
* - Adds action buttons where 'wikidialog-submit/selfpublish' class tags are placed
* - Creates menu items in the main menu
* - The archive option will auto-add when an article is ready
* - Provides confirmation dialogs before performing actions
* - Shows loading states and success/error notifications
* 
* Documentation can be found at [[Wn/bn/উইকিসংবাদ:উইকিকার্য]]
* 
* @requires Vue 3
* @requires Wikimedia Codex
*/

/**
 * Sources and Inspirations:
 * @source https://incubator.wikimedia.org/wiki/User:Syunsyunminmin/wikinews/easy-dialog.js
 * @source https://www.mediawiki.org/wiki/Codex
 * @source https://meta.wikimedia.org/wiki/User:দিব্য_দত্ত/Script/Shorturl.js
 */


const i18n = {
    // Admin: When Wikinews is promoted to its own site, remove the 'Wn/bn' prefix from these template names
    // and change 'Category' to 'বিষয়শ্রেণী', 'Image' to 'চিত্র'
    maintinenceTemplates: [ "Wn/bn/উন্নয়ন চলছে", "Wn/bn/কাজ চলছে", "Wn/bn/সক্রিয়ভাবে সম্পাদিত হচ্ছে", "Wn/bn/করণীয়", "Wn/bn/পরিষ্করণ", "Wn/bn/স্বল্প উৎস", "Wn/bn/রচনাগত সমস্যা", "Wn/bn/কপিরাইট", "Wn/bn/বিতর্কিত", "Wn/bn/প্রাযুক্তিক সমস্যা", "Wn/bn/নিরপেক্ষতা", "Wn/bn/একাধিক সমস্যা"],
    reviewTemplate: "Wn/bn/নিরীক্ষা",
    selfPublishedTemplate: "Wn/bn/অনিরীক্ষিত প্রকাশ",
    publishTemplate: "Wn/bn/প্রকাশিত",
    oldPublishTemplate: "Wn/bn/প্রকাশ করুন",
    missingImageTemplate: 'Wn/bn/চিত্র অনুপস্থিত',
    archivedTemplate: "Wn/bn/সংগ্রহশালা",
    categoryLabel: "Category",
    filePrefix: 'File',
    imagePrefix: 'Image',

    // Messages
    loginRequired: "আপনাকে এই কার্যটি সঞ্চালন করার জন্য প্রবেশ (লগ ইন) করতে হবে।",
    namespaceError: "এই কার্যটি শুধুমাত্র নিবন্ধের নামস্থানে ব্যবহার করা যেতে পারে।",
    confirmSubmitReview: "আপনি কি এই নিবন্ধটিকে নিরীক্ষণের জন্য জমা করার বিষয়ে নিশ্চিত?",
    alreadySubmitted: 'এই নিবন্ধটি ইতিমধ্যে নিরীক্ষার জন্য জমা দেওয়া হয়েছে।',
    cannotBeSubmitted: 'এই নিবন্ধটি নিরীক্ষণের জন্য জমা দেওয়া যাবে না কারণ এটি ইতিমধ্যে প্রকাশিত হয়েছে।',
    confirmSelfPublish: "আপনি কি নিবন্ধটিকে স্ব-প্রকাশিত করার বিষয়ে নিশ্চিত?",
    alreadyPublished: "এই নিবন্ধটি ইতিমধ্যে প্রকাশিত হয়েছে।",
    confirmArchive: "আপনি কি নিবন্ধটিকে সংগ্রহশালাভুক্ত করার বিষয়ে নিশ্চিত?",
    alreadyArchived: "এই নিবন্ধটিকে ইতিমধ্যেই সংগ্রহশালা ভুক্ত করা হয়েছে।",
    editFailed: "দুঃখিত! সম্পাদনা ব্যর্থ হয়েছে। কিছু পরে পুনরায় চেষ্টা করুন।",
    editSuccess: "সম্পাদনা সফল হয়েছে।",
    fetchContentFailed: "দুঃখিত! পৃষ্ঠার বিষয়বস্তু উপলব্ধি করতে ব্যর্থ হয়েছে৷ পুনরায় চেষ্টা করুন; এই ত্রুটি বজায় থাকলে কোনো প্রশাসকের সাথে যোগাযোগ করুন।",
    bengaliWikinewsNotice: "সুপ্রিয় সম্পাদক, আপনি যে কার্যটি সঞ্চালন করতে চান তার জন্য মিডিয়াউইকি:Common.js পৃষ্ঠা থেকে জাভাস্ক্রিপ্ট প্রয়োজন। কিন্তু সেই জাভাস্ক্রিপ্টটি ইনকিউবেটরের জন্য লেখা, এবং এটিকে bn.wikinews-এ ব্যবহার করার জন্য হালনাগাদ করার প্রয়োজন। অনুগ্রহ করে একজন স্থানীয় ইন্টারফেস প্রশাসক বা গ্লোবাল স্টুয়ার্ডের সাথে যোগাযোগ করুন এবং উনাদের কাজগুলি করতে বলুন, যেমন 'Wn/bn' উপসর্গটি অপসারণ করা এবং 'বিষয়শ্রেণী' দিয়ে 'Category' পরিবর্তন করা। ধন্যবাদ",

    // Labels
    loadingLabel: 'লোড হচ্ছে...',
    submitForReviewLabel: 'নিরীক্ষণের জন্য জমাদান',
    submitForReviewTitle: 'নিবন্ধটিকে নিরীক্ষণের জন্য জমা করুন',
    selfPublishLabel: 'প্রকাশিত করুন',
    selfPublishTitle: 'নিবন্ধটিকে স্ব-প্রকাশিত করুন',
    archiveArticleLabel: 'সংগ্রহশালা ভুক্ত করুন',
    archiveArticleTitle: 'নিবন্ধটিকে সংগ্রহশালা ভুক্ত করুন',
    warningTitle: "সতর্কীকরণ",
    confirmLabel: "নিশ্চিত",
    cancelLabel: "বাতিল করুন",
    closeLabel: "বন্ধ করুন",
    okLabel: "ঠিক আছে",

    // Dialog titles
    confirmSubmitReviewTitle: "নিরীক্ষার জন্য জমা নিশ্চিত করুন",
    confirmSelfPublishTitle: "স্ব-প্রকাশ নিশ্চিত করুন",
    confirmArchiveTitle: "সংগ্রহশালাভুক্ত করা নিশ্চিত করুন",

    // Edit summaries
    submitForReviewSummary: "নিরীক্ষণের জন্য জমা দেওয়া হয়েছে।",
    selfPublishSummary: "স্ব-প্রকাশিত করা হয়েছে।",
    archiveArticleSummary: "সংগ্রহশালা ভুক্ত করা হয়েছে।",

    // Error messages
    hostError: "এই কার্যটিকে শুধুমাত্র ইনকিউবেটরে সঞ্চালন করা যাবে।",
    
    // Easy share 
    shareText: "বাংলা উইকিসংবাদ থেকে একটি তথ্যপূর্ণ নিবন্ধ: ",
    shareLabel: "শেয়ার করুন!",
    copyUrlLabel: "ইউআরএল অনুলিপি করুন",
    pdfLabel: "পিডিএফ ডাউনলোড",
    emailLabel: "ইমেইল",
    facebookLabel: "ফেসবুক",
    whatsappLabel: "হোয়াটসঅ্যাপ",
    telegramLabel: "টেলিগ্রাম",
    copySuccess: "সংক্ষিপ্ত ইউআরএল ক্লিপবোর্ডে অনুলিপি করা হয়েছে!",
    copyPrompt: "এই সংক্ষিপ্ত ইউআরএলটি অনুলিপি করুন:",
    emailSubject: "বাংলা উইকিসংবাদ থেকে একটি নিবন্ধ: ",
    shortLabel: "কপি",
    pdfShortLabel: "পিডিএফ"
};

const config = {
    allowedHosts: ['test.wikipedia.org', 'test.m.wikipedia.org', 'bn.wikinews.org', 'bn.m.wikinews.org'],
    bengaliWikinews: ['bn.wikinews.org', 'bn.m.wikinews.org'],
    articleNamespace: 0,
    portletId: mw.config.get('skin') === 'vector-2022' ? "p-cactions" : "p-tb",
    
    icons: {
        share: '//upload.wikimedia.org/wikipedia/commons/4/40/Ic_share_48px.svg',
        loading: '//upload.wikimedia.org/wikipedia/commons/9/92/Loading_icon_cropped.gif',
        socials: {
            copyUrl: '//upload.wikimedia.org/wikipedia/commons/b/b6/Linkiconred.png',
            facebook: '//upload.wikimedia.org/wikipedia/commons/b/b8/2021_Facebook_icon.svg',
            whatsapp: '//upload.wikimedia.org/wikipedia/commons/c/cc/WhatsApp_Logo.svg',
            telegram: '//upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg',
            pdf: '//upload.wikimedia.org/wikipedia/commons/6/6c/Adobe_PDF_icon.svg',
            email: '//upload.wikimedia.org/wikipedia/commons/7/7f/OOjs_UI_icon_message.svg'
        }
    }
};

// Load required MediaWiki modules before initializing
mw.loader.using(['mediawiki.api', 'mediawiki.util', 'vue', '@wikimedia/codex']).then(() => {

    const wikiDialog = window.wikiDialog || {};
    window.wikiDialog = wikiDialog;
    wikiDialog.api = new mw.Api();
    
    // Import required Vue components
    const Vue = mw.loader.require('vue');
    const { CdxDialog, CdxMessage, CdxButton, CdxProgressBar } = mw.loader.require('@wikimedia/codex');
    
    // Constants for UI timing
    const NOTIFICATION_TIMEOUT = 3000;
    const RELOAD_DURATION = 1500;
    
    // Creates and appends loading overlay to document
    const createLoadingPopup = () => {
        const popup = document.createElement('div');
        popup.id = 'loadingPopup';
        popup.style.display = 'none';
        popup.innerHTML = `
            <div class="wiki-dialog-overlay">
                <div class="wiki-dialog-loading-container">
                    <img src="${config.icons.loading}" alt="Loading..." class="wiki-dialog-loading-icon">
                    <div class="wiki-dialog-loading-text">${i18n.loadingLabel}</div>
                </div>
            </div>
        `;
        document.body.appendChild(popup);
        return popup;
    };

    // Handles template-related operations
    const TemplateManager = {
        // Generate regex patterns for finding templates
        patterns: (templateName) => [
            new RegExp(`{{\\s*${templateName}\\s*(?:\\|[^}]*)?}}`, 'gi'),
            new RegExp(`{{\\s*:?[Tt]emplate:${templateName}\\s*(?:\\|[^}]*)?}}`, 'gi'),
            new RegExp(`{{[\n\r\s]*${templateName}[\n\r\s]*(?:\\|[^}]*)?}}`, 'gi')
        ],

        // Check if template exists in content
        find(content, templateName) {
            return this.patterns(templateName).some(pattern => pattern.test(content));
        },

        // Get template position and content
        getPosition(content, templateName) {
            for (const pattern of this.patterns(templateName)) {
                pattern.lastIndex = 0;
                const match = pattern.exec(content);
                if (match) {
                    return {
                        start: match.index,
                        end: match.index + match[0].length,
                        template: match[0]
                    };
                }
            }
            return null;
        },

        // Create template string with optional parameters
        wrap(template, params = '') {
            return `{{${template}${params ? '|' + params : ''}}}`;
        }
    };
    
    const ContentProcessor = {
	    // Remove HTML comments from content
	    removeHtmlComments(content) {
	        return content.replace(/<!--[\s\S]*?-->/g, '');
	    },
	
	    // Wrap file links with Missing Image template
	      wrapFilesWithMissingImage(content, missingImageTemplate) {
		    return content
		        .replace(
		            new RegExp(`\\[\\[${i18n.filePrefix}:([^\\]]*)\\]\\]`, 'g'),
		            (match, fileName) => `{{${missingImageTemplate}|${i18n.filePrefix}:${fileName}}}`
		        )
		        .replace(
		            new RegExp(`\\[\\[${i18n.imagePrefix}:([^\\]]*)\\]\\]`, 'g'),
		            (match, imageName) => `{{${missingImageTemplate}|${i18n.imagePrefix}:${imageName}}}`
		        );
		}
	};

    // Manages content modifications
    const ContentManager = {
        // Remove specified maintenance templates from content
        removeMaintenanceTemplates(content, templates) {
            return templates.reduce((acc, template) => {
                const position = TemplateManager.getPosition(acc, template);
                return position ? 
                    acc.slice(0, position.start) + acc.slice(position.end) :
                    acc;
            }, content).trim();
        },

        // Insert template before category
        insertTemplateBeforeCategories(content, templateName, categoryLabel) {
            const categoryPattern = new RegExp(`\\[\\[${categoryLabel}:[^\\]]*\\]\\]`);
            const categoryMatch = content.match(categoryPattern);
            
            if (categoryMatch) {
                const categoryIndex = content.indexOf(categoryMatch[0]);
                return `${content.slice(0, categoryIndex)}${TemplateManager.wrap(templateName)}\n${content.slice(categoryIndex)}`;
            }
            return `${content}\n${TemplateManager.wrap(templateName)}`;
        },

        // Add archive template after publish template
        addArchiveTemplate(content, publishTemplate, archivedTemplate, missingImageTemplate) {
	        // First process the content
	        let processedContent = ContentProcessor.removeHtmlComments(content);
	        processedContent = ContentProcessor.wrapFilesWithMissingImage(processedContent, missingImageTemplate);
	
	        const wrappedPublishTemplate = TemplateManager.wrap(publishTemplate);
	        const publishIndex = processedContent.indexOf(wrappedPublishTemplate);
	
	        return publishIndex !== -1 ?
	            `${processedContent.slice(0, publishIndex + wrappedPublishTemplate.length)}\n${TemplateManager.wrap(archivedTemplate)}\n${processedContent.slice(publishIndex + wrappedPublishTemplate.length)}` :
	            this.insertTemplateBeforeCategories(processedContent, archivedTemplate);
	    }
    };
    
    const DateManager = {
        async getPageCreationDate() {
            try {
                const result = await wikiDialog.api.get({
                    action: "query",
                    format: "json",
                    prop: "revisions",
                    titles: mw.config.get('wgPageName'),
                    formatversion: "2",
                    rvprop: "timestamp",
                    rvlimit: 1,
                    rvdir: "newer" 
                });
                
                const page = result.query.pages[0];
                if (page.revisions && page.revisions[0]) {
                    return new Date(page.revisions[0].timestamp);
                }
                throw new Error('Could not find page creation date');
            } catch (error) {
                console.error('Error getting page creation date:', error);
                return null;
            }
        },

        isOneMonthOld(creationDate) {
            if (!creationDate) return false;
            const oneMonthAgo = new Date();
            oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
            return creationDate <= oneMonthAgo;
        }
    };

	    // Handles security validations
	    const SecurityManager = {
	        checks: [
	            {
	                check: () => mw.user.isAnon(),
	                message: i18n.loginRequired
	            },
	            {
	                check: () => !config.allowedHosts.includes(window.location.host),
	                message: i18n.hostError
	            },
	            {
	                check: () => config.bengaliWikinews.includes(window.location.host),
	                message: i18n.bengaliWikinewsNotice
	            },
	            {
	                check: () => mw.config.get("wgNamespaceNumber") !== config.articleNamespace,
	                message: i18n.namespaceError
	            }
	        ],

	    performChecks() {
	        const failedCheck = this.checks.find(({ check }) => check());
	        return { passed: !failedCheck, message: failedCheck?.message };
	    }
    };

    // Create and configure Vue application
    const createApp = () => {
        const mountPoint = document.createElement('div');
        mountPoint.id = 'wiki-dialog-app';
        document.body.appendChild(mountPoint);

        return Vue.createMwApp({
            data: () => ({
                i18n,
                config,
                dialogOpen: false,
                dialogTitle: '',
                dialogContent: '',
                showMessage: false,
                messageType: '',
                messageContent: '',
                confirmCallback: null,
                showProgressBar: false,
                isWarningDialog: false,
                isInitialLoading: false,
                isArchiveEnabled: false
            }),

            methods: {
                // Toggle loading overlay
                toggleLoading(show) {
                    document.getElementById('loadingPopup').style.display = show ? 'block' : 'none';
                    this.isInitialLoading = show;
                },

                // Fetch page content from API
                async getPageContent() {
                    try {
                        const result = await wikiDialog.api.get({
                            action: "query",
                            format: "json",
                            prop: "revisions",
                            titles: mw.config.get('wgPageName'),
                            formatversion: "2",
                            rvprop: "content",
                            rvslots: "*"
                        });
                        return result.query.pages[0].revisions[0].slots.main.content;
                    } catch (error) {
                        throw new Error(i18n.fetchContentFailed);
                    }
                },

                // Save edited content via API
                async editPageContent(content, summary) {
                    try {
                        const result = await wikiDialog.api.postWithToken('csrf', {
                            action: "edit",
                            format: "json",
                            title: mw.config.get('wgPageName'),
                            formatversion: "2",
                            nocreate: 1,
                            text: content,
                            summary
                        });
                        
                        if (result.error) throw new Error(result.error.info);
                        
                        this.showNotification(i18n.editSuccess, 'success');
                        setTimeout(() => location.reload(), RELOAD_DURATION);
                    } catch (error) {
                        this.showNotification(`${i18n.editFailed}\n\n${error.message}`, 'error');
                    }
                },

                // UI Dialog management methods
                showDialog(title, content, callback, isWarning = false) {
                    Object.assign(this, {
                        dialogTitle: title,
                        dialogContent: content,
                        confirmCallback: callback,
                        dialogOpen: true,
                        showProgressBar: false,
                        isWarningDialog: isWarning
                    });
                },

                closeDialog() {
                    this.dialogOpen = false;
                },

                showWarning(message) {
                    this.showDialog(i18n.warningTitle, message, null, true);
                },

                // Handle dialog confirmation
                async confirmAction() {
                    this.showProgressBar = true;
                    if (this.confirmCallback) {
                        try {
                            await this.confirmCallback();
                        } catch (error) {
                            console.error('Error in confirmCallback:', error);
                        }
                    }
                    if (this.isWarningDialog) {
                        this.closeDialog();
                    }
                },

                // Notification system methods
                showNotification(message, type = 'notice') {
                    this.messageContent = message;
                    this.messageType = type;
                    this.showMessage = true;

                    if (type === 'success') {
                        setTimeout(() => {
                            this.showMessage = false;
                        }, NOTIFICATION_TIMEOUT);
                    }
                },
                
                handleMessageDismiss() {
                    this.showMessage = false;
                },
                
                async isArchiveReady() {
	                try {
	                    const pageContent = await this.getPageContent();
	                    const creationDate = await DateManager.getPageCreationDate();
	                    
	                    // Check template conditions
	                    const hasPublish = TemplateManager.find(pageContent, i18n.publishTemplate) || 
	                                     TemplateManager.find(pageContent, i18n.oldPublishTemplate);
	                    const hasSelfPublished = TemplateManager.find(pageContent, i18n.selfPublishedTemplate);
	                    const hasArchived = TemplateManager.find(pageContent, i18n.archivedTemplate);
	                    
	                    // Check age condition
	                    const isOldEnough = DateManager.isOneMonthOld(creationDate);
	
	                    // All conditions must be met
	                    return hasPublish && !hasSelfPublished && isOldEnough && !hasArchived;
	                } catch (error) {
	                    console.error('Error checking archive conditions:', error);
	                    return false;
	                }
	            },

                // Main action handler for review/publish/archive operations
                async handleAction(actionType, title, content) {
                    const securityCheck = SecurityManager.performChecks();
                    if (!securityCheck.passed) {
                        this.showWarning(securityCheck.message);
                        return;
                    }

                    this.toggleLoading(true);
                    
                    try {
                        const pageContent = await this.getPageContent();
                        let newContent = ContentManager.removeMaintenanceTemplates(pageContent, i18n.maintinenceTemplates);
                        
                        // Template definitions
                        const templates = {
                            review: i18n.reviewTemplate,
                            selfPublished: i18n.selfPublishedTemplate,
                            publish: i18n.publishTemplate,
                            oldPublish: i18n.oldPublishTemplate,
                            archived: i18n.archivedTemplate
                        };
                        
                        // Check current template status
                        const templateStatus = {
                            hasNoChanges: newContent === pageContent,
                            hasSelfPublished: TemplateManager.find(newContent, templates.selfPublished),
                            hasPublished: TemplateManager.find(newContent, templates.publish) || 
                                        TemplateManager.find(newContent, templates.oldPublish),
                            hasArchived: TemplateManager.find(newContent, templates.archived),
                            hasReview: TemplateManager.find(newContent, templates.review)
                        };

                        // Define action handlers
                        const actions = {
                            review: () => {
                                if (templateStatus.hasReview) {
                                    throw new Error(i18n.alreadySubmitted);
                                }
                                if (templateStatus.hasPublished) {
                                    throw new Error(i18n.cannotBeSubmitted);
                                }
                                return async () => {
                                    const content = `${TemplateManager.wrap(templates.review)}\n${newContent}`;
                                    await this.editPageContent(content, i18n.submitForReviewSummary);
                                };
                            },
                            
                            publish: () => {
                                if (templateStatus.hasSelfPublished && templateStatus.hasPublished) {
                                    throw new Error(i18n.alreadyPublished);
                                }
                                return async () => {
                                    let content = newContent;
                                    
                                    if (templateStatus.hasReview) {
                                        const reviewPosition = TemplateManager.getPosition(content, templates.review);
                                        if (reviewPosition) {
                                            content = content.slice(0, reviewPosition.start) + 
                                                    content.slice(reviewPosition.end);
                                            content = content.trim();
                                        }
                                    }
                                    if (!templateStatus.hasSelfPublished) {
                                        content = `${TemplateManager.wrap(templates.selfPublished)}\n${content}`;
                                    }
                                    if (!templateStatus.hasPublished) {
                                        content = ContentManager.insertTemplateBeforeCategories(
                                            content, 
                                            templates.publish, 
                                            i18n.categoryLabel
                                        );
                                    }
                                    await this.editPageContent(content, i18n.selfPublishSummary);
                                };
                            },
                            
                            archive: () => {
							    if (templateStatus.hasArchived) {
							        throw new Error(i18n.alreadyArchived);
							    }
							    return async () => {
							        const content = ContentManager.addArchiveTemplate(
							            newContent,
							            templates.publish,
							            templates.archived,
							            i18n.missingImageTemplate
							        );
							        await this.editPageContent(content, i18n.archiveArticleSummary);
							    };
							}
                        };

                        try {
                            const callback = actions[actionType]();
                            this.toggleLoading(false);
                            this.showDialog(title, content, callback);
                        } catch (error) {
                            this.toggleLoading(false);
                            this.showWarning(error.message);
                        }
                    } catch (error) {
                        this.toggleLoading(false);
                        this.showNotification(error.message, 'error');
                    }
                },

                // Initialize UI buttons
                initializeButtons() {
                    const buttonConfigs = [
                        { 
                            className: 'wikidialog-submit',
                            action: () => this.handleAction('review', i18n.confirmSubmitReviewTitle, i18n.confirmSubmitReview)
                        },
                        {
                            className: 'wikidialog-selfpublish',
                            action: () => this.handleAction('publish', i18n.confirmSelfPublishTitle, i18n.confirmSelfPublish)
                        }
                    ];

                    buttonConfigs.forEach(this.createButton);
                    this.addPortletLinks();
                },

                // Create individual button elements
                createButton({ className, action }) {
                    document.querySelectorAll(`.${className}`).forEach(element => {
                        const text = element.getAttribute("data-button-text");
                        if (text) {
                            const button = document.createElement('button');
                            button.textContent = text;
                            button.className = `${className} ${element.getAttribute("data-class") || ''}`;
                            
                            const style = element.getAttribute("style");
                            if (style) button.setAttribute('style', style);
                            
                            element.innerHTML = '';
                            element.appendChild(button);
                            button.addEventListener("click", action);
                        }
                    });
                },

                // Add links to toolbar portlet
                async addPortletLinks() {
	                if (mw.config.get("wgNamespaceNumber") !== config.articleNamespace) return;
	
	                // Check if archive should be enabled
	                this.isArchiveEnabled = await this.isArchiveReady();
	
	                // Configure portlet links for different actions
	                const linkConfigs = [
	                    {
	                        label: i18n.submitForReviewLabel,
	                        id: "ca-review-action",
	                        title: i18n.submitForReviewTitle,
	                        action: () => this.handleAction('review', i18n.confirmSubmitReviewTitle, i18n.confirmSubmitReview)
	                    },
	                    {
	                        label: i18n.selfPublishLabel,
	                        id: "ca-replace-publish",
	                        title: i18n.selfPublishTitle,
	                        action: () => this.handleAction('publish', i18n.confirmSelfPublishTitle, i18n.confirmSelfPublish)
	                    }
	                ];
	
	                // Only add archive link if conditions are met
	                if (this.isArchiveEnabled) {
	                    linkConfigs.push({
	                        label: i18n.archiveArticleLabel,
	                        id: "ca-archive-article",
	                        title: i18n.archiveArticleTitle,
	                        action: () => this.handleAction('archive', i18n.confirmArchiveTitle, i18n.confirmArchive)
	                    });
	                }
	
	                linkConfigs.forEach(this.createPortletLink);
	                this.updatePortletLinkVisibility();
	            },
            
            // Create individual portlet link
                createPortletLink({ label, id, title, action }) {
                    const link = mw.util.addPortletLink(config.portletId, "javascript:void(0);", label, id, title);
                    if (link) link.addEventListener('click', action);
                },

            // Modify updatePortletLinkVisibility to only handle non-archive links
            updatePortletLinkVisibility() {
                const linkConfigs = [
                    { buttonClass: "wikidialog-submit", linkId: "ca-review-action" },
                    { buttonClass: "wikidialog-selfpublish", linkId: "ca-replace-publish" }
                ];

                linkConfigs.forEach(({ buttonClass, linkId }) => {
                    if (!document.querySelector(`.${buttonClass}`) && !document.getElementById(buttonClass)) {
                        const linkElement = document.getElementById(linkId);
                        if (linkElement) linkElement.style.display = "none";
                    }
                });
            },
            
                // Inject required CSS styles
                injectStyles() {
                    const styles = `
                        /* Overlay styles for loading state */
                        .wiki-dialog-overlay { display: flex; justify-content: center; align-items: center; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(250, 249, 249, 0.5); z-index: 10000; }
                        html.skin-theme-clientpref-night .wiki-dialog-overlay { background-color: rgba(0, 0, 0, 0.7); }
                        .wiki-dialog-loading-container { text-align: center; background-color: #FFFFFF; border: 1px solid #CCCCCC; padding: 20px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); }
                        .wiki-dialog-loading-icon { width: 36px; height: 36px; }
                        .wiki-dialog-loading-text { margin-top: 10px; font-size: 14px; color: #333; }
                        
                        /* Dialog styles */
                        .dialog-footer { display: flex; justify-content: flex-end; gap: 12px; margin-bottom: 10px; }
                        .cdx-dialog--warning .cdx-dialog__header, .cdx-dialog__header--warning { background-color: #fdf2d5; color: black; }
                        html.skin-theme-clientpref-night .cdx-dialog--warning .cdx-dialog__header, 
                        html.skin-theme-clientpref-night .cdx-dialog__header--warning { background-color: #453217; color: white; }
                        
                        /* Notification styles */
                        .wiki-dialog-notification { position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); width: 60%; z-index: 999; }
                        @media screen and (max-width: 768px) { .wiki-dialog-notification { width: 90%; } }
                    `;

                    const styleElement = document.createElement('style');
                    styleElement.textContent = styles;
                    document.head.appendChild(styleElement);
                }
            },
            
            // Initialize UI on component mount
            mounted() {
                this.initializeButtons();
                this.injectStyles();
            },

            // Vue template for the dialog interface
            template: `
                <div>
                    <!-- Main dialog component -->
                    <cdx-dialog v-model:open="dialogOpen" :title="dialogTitle" :close-button-label="i18n.closeLabel" @close="closeDialog" :class="{ 'cdx-dialog--warning': isWarningDialog }">
                        <template #default><p>{{ dialogContent }}</p></template>
                        <template #footer>
                            <div class="dialog-footer">
                                <cdx-button v-if="!isWarningDialog" action="normal" @click="closeDialog">{{ i18n.cancelLabel }}</cdx-button>
                                <cdx-button v-if="isWarningDialog" action="normal" @click="closeDialog">{{ i18n.okLabel }}</cdx-button>
                                <cdx-button v-if="!isWarningDialog" action="progressive" weight="primary" @click="confirmAction">{{ i18n.confirmLabel }}</cdx-button>
                            </div>
                            <cdx-progress-bar v-if="showProgressBar" :inline="true" />
                        </template>
                    </cdx-dialog>

                    <!-- Notification component -->
                    <div v-if="showMessage" class="wiki-dialog-notification">
                        <cdx-message :type="messageType" :fade-in="true" :auto-dismiss="messageType === 'success'" :display-time="NOTIFICATION_TIMEOUT" :dismiss-button-label="i18n.closeLabel" @dismissed="handleMessageDismiss">{{ messageContent }}</cdx-message>
                    </div>
                </div>
            `
        })
        .component('cdx-dialog', CdxDialog)
        .component('cdx-message', CdxMessage)
        .component('cdx-button', CdxButton)
        .component('cdx-progress-bar', CdxProgressBar)
        .mount(mountPoint);
    };

    // Initialize application
    createLoadingPopup();
    createApp();
});


/**
* WikiDialog - Quick Share functionality
* @version 2.0
* 
* A script that adds a share functionality button to Wikinews articles.
* Creates a dropdown menu with multiple sharing options:
* - Copy shortened URL
* - Download as PDF
* - Share via Email
* - Share to social platforms (Facebook, WhatsApp, Telegram)
* 
* Features:
* - Automatically generates shortened URLs via Meta-Wiki API
* - Responsive dropdown positioning based on screen space
* - Clipboard support with fallback to manual copy
* 
* @requires MediaWiki API
* @requires MediaWiki ForeignApi
* @requires jQuery
*/

mw.loader.using(["mediawiki.api", 'mediawiki.ForeignApi']).then(() => {
    // Check for required DOM elements and namespace
    const hasRequiredIds = $('#wikidialog-quick-share').length && $('#publish').length;
    const isArticleNamespace = mw.config.get('wgNamespaceNumber') === config.articleNamespace;
    
    if (!hasRequiredIds || !isArticleNamespace) return;
    
    // Inject required styles for share functionality
    document.head.appendChild(Object.assign(document.createElement('style'), { textContent: `
    .share-container{display:inline-block;position:relative;}
    .share-icon{width:22px;height:22px;cursor:pointer;transition:transform 0.3s ease;}
    .share-icon:hover{transform:scale(1.1);}
    .share-dropdown{display:none;position:absolute;background:#fff;min-width:200px;box-shadow:0 2px 8px rgba(0,0,0,0.15);border:1px solid #a2a9b1;border-radius:4px;z-index:100;padding:12px;}
    .share-icons{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;}
    .share-icon-wrapper{display:flex;flex-direction:column;align-items:center;text-align:center;}
    .share-icon-item{width:32px;height:32px;cursor:pointer;transition:transform 0.2s;margin-bottom:4px;}
    .share-icon-item:hover{transform:scale(1.1);}
    .share-label{font-size:12px;color:#202122;}
`}));

    // Helper function to create icon elements with labels
    const createIcon = (src, alt, label) => {
        const wrapper = Object.assign(document.createElement('div'), { className: 'share-icon-wrapper' });
        const img = Object.assign(document.createElement('img'), { className: 'share-icon-item', src, alt, title: alt });
        const labelEl = Object.assign(document.createElement('span'), { className: 'share-label', textContent: label });
        wrapper.appendChild(img);
        wrapper.appendChild(labelEl);
        return wrapper;
    };

    // Create main container and share button
    const container = Object.assign(document.createElement('div'), { className: 'share-container' });
    const shareIcon = Object.assign(document.createElement('img'), { 
        className: 'share-icon skin-invert', 
        src: config.icons.share, 
        alt: 'Share' ,
        title: i18n.shareLabel
    });
    const dropdown = Object.assign(document.createElement('div'), { className: 'share-dropdown' });
    const iconsContainer = Object.assign(document.createElement('div'), { className: 'share-icons' });

    // Define share options with their labels and icons
    const icons = {
        copyUrl: [i18n.copyUrlLabel, config.icons.socials.copyUrl, i18n.shortLabel],
        pdf: [i18n.pdfLabel, config.icons.socials.pdf, i18n.pdfShortLabel],
        email: [i18n.emailLabel, config.icons.socials.email, i18n.emailLabel],
        facebook: [i18n.facebookLabel, config.icons.socials.facebook, i18n.facebookLabel],
        whatsapp: [i18n.whatsappLabel, config.icons.socials.whatsapp, i18n.whatsappLabel],
        telegram: [i18n.telegramLabel, config.icons.socials.telegram, i18n.telegramLabel]
    };

    // Create icon elements from configuration
    const iconElements = Object.entries(icons).reduce((acc, [key, [alt, src, label]]) => ({ 
        ...acc, 
        [key]: createIcon(src, alt, label) 
    }), {});

    // Assemble the dropdown menu
    Object.values(iconElements).forEach(icon => iconsContainer.appendChild(icon));
    dropdown.appendChild(iconsContainer);
    container.appendChild(shareIcon);
    container.appendChild(dropdown);

    // Calculate and set dropdown position based on available screen space
    const positionDropdown = () => {
        const rect = shareIcon.getBoundingClientRect();
        const space = {
            right: window.innerWidth - rect.right,
            left: rect.left,
            bottom: window.innerHeight - rect.bottom
        };

        Object.assign(dropdown.style, 
            space.right >= 220 
                ? { left: '0', right: 'auto', top: '100%', bottom: 'auto', transform: 'none' } 
                : space.left >= 220 
                ? { right: '0', left: 'auto', top: '100%', bottom: 'auto', transform: 'none' }
                : space.bottom >= 300 
                ? { left: '50%', right: 'auto', top: '100%', bottom: 'auto', transform: 'translateX(-50%)' }
                : { left: '50%', right: 'auto', top: 'auto', bottom: '100%', transform: 'translateX(-50%)' }
        );
    };

    // Handle share button click events
    let isOpen = false;
    shareIcon.addEventListener('click', e => {
        e.stopPropagation();
        isOpen = !isOpen;
        dropdown.style.display = isOpen ? 'block' : 'none';
        if (isOpen) positionDropdown();
        shareIcon.classList.toggle('active', isOpen);
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', e => {
        if (!container.contains(e.target) && isOpen) {
            isOpen = false;
            dropdown.style.display = 'none';
            shareIcon.classList.remove('active');
        }
    });

    // Insert share button into the page
    $('#wikidialog-quick-share').append(container);
    
    // Get shortened URL from Meta-Wiki API
    new mw.ForeignApi('https://meta.wikimedia.org/w/api.php').post({
        action: 'shortenurl',
        url: location.href
    }).done(({ shortenurl: { shorturl } }) => {
        const pageTitle = mw.config.get('wgPageName');
        const text = `${i18n.shareText}"${pageTitle}" ${shorturl}`;
        
        // Define handlers for each share option
        const handlers = {
            copyUrl: () => navigator.clipboard.writeText(shorturl)
                .then(() => mw.notify(i18n.copySuccess, {type: 'success'}))
                .catch(() => prompt(i18n.copyPrompt, shorturl)),
            pdf: () => window.open(`${mw.config.get('wgServer')}${mw.config.get('wgScriptPath')}/index.php?title=Special:DownloadAsPdf&page=${encodeURIComponent(pageTitle)}&action=show-download-screen`),
            email: () => window.open(`mailto:?subject=${encodeURIComponent(`${i18n.emailSubject}${pageTitle}`)}&body=${encodeURIComponent(text)}`),
            facebook: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shorturl)}&quote=${encodeURIComponent(text)}`),
            whatsapp: () => window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`),
            telegram: () => window.open(`https://t.me/share/url?url=${encodeURIComponent(shorturl)}&text=${encodeURIComponent(text)}`)
        };

        Object.entries(handlers).forEach(([platform, handler]) => 
            iconElements[platform].addEventListener('click', () => {
                handler();
                isOpen = false;
                dropdown.style.display = 'none';
                shareIcon.classList.remove('active');
            }));
    });
    
});

// </nowiki>
