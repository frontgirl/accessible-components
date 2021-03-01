import Helpers from "./helpers";

const TABS_SELECTOR = "[data-tab] > a";
const TABS_TABWRAPPER_ATTR = 'data-tab';
const TABS_TABWRAPPER_SELECTOR = `[${TABS_TABWRAPPER_ATTR}]`;
const TABS_GROUP_ATTR = 'data-tabs';
const TABS_GROUP_SELECTOR = `[${TABS_GROUP_ATTR}]`;
const TABS_PANEL_SELECTOR = "[data-tab-panel]";

const helpers = Helpers();

export default function Tabs() {
    /* Properties */

    //index value for local storage. Uses the current URL to uniquely mark the page
    //potential problem here where the URL changes
    const _storageIndex = `selectedTabPanel${document.location}`;
    /* Constructor Helpers */

    // First run setup
    function _setup() {
        //make all tablist anchors unselectable and label all tabs with their role
        const tabListAnchors = document.querySelectorAll(TABS_SELECTOR);

        for (const tabAnchor of tabListAnchors) {
            tabAnchor.setAttribute("tabindex", "-1");
            tabAnchor.parentElement.setAttribute("role", "tab");
            tabAnchor.parentElement.parentElement.setAttribute("role", "tablist");
            //check if there's a matching panel
            const tabPanelID = tabAnchor.getAttribute("href");
            const tabPanel = document.querySelector(tabPanelID);
            if (!tabPanel) {
                //There's an error in makup - there's no tab matching to the panel
                throw `The panel with id ${tabPanelID} does not exist. You can find an example of correct markdown at https://github.com/frontgirl/accessible-components`;
            }
        }

        //fetch previously selected tabs
        const currentTabs = _getCurrentTabs();

        //fetch all tab groups
        const tabGroups = document.querySelectorAll(TABS_GROUP_SELECTOR);

        //initialise tabs
        for (const tabGroup of tabGroups) {
            //hide tab panels (for all tab groups)
            const tabPanels = tabGroup.querySelectorAll(TABS_PANEL_SELECTOR);

            //stores if any tab is currently shown
            let anyShown = false;

            for (const tabPanel of tabPanels) {
                //tab associated with this tab panel
                const associatedTab = document.querySelector(`${TABS_TABWRAPPER_SELECTOR}>a[href='#${tabPanel.id}']`);
                if (!associatedTab) {
                    //There's an error in makup - there's no tab matching to the panel
                    throw `The panel with id ${tabPanel.id} doesn't have matching tab. You can find an example of correct markdown at https://github.com/frontgirl/accessible-components`;
                }
                //if tab panel ID is not in currentTabs
                if (currentTabs.indexOf(`#${tabPanel.id}`) === -1) {
                    //hide it
                    helpers.setVisibility(tabPanel);
                    //remove from tab order
                    associatedTab.parentElement.setAttribute("tabindex", "-1");
                    tabPanel.setAttribute("tabindex", "-1");
                } else {
                    //leave it visible
                    anyShown = true;
                    tabPanel.setAttribute("role", "tabpanel");
                    tabPanel.setAttribute("tabindex", "0");
                    //select
                    associatedTab.parentElement.setAttribute("aria-selected", "true");
                    //restore to tab order
                    associatedTab.parentElement.setAttribute("tabindex", "0");
                }
            }

            //if any tab panels are selected, we're done
            if (!anyShown) {
                //if there's no selected tabs,
                //select the first tab as default

                //show the first tab panel
                helpers.setVisibility(tabPanels[0], true);
                tabPanels[0].setAttribute("tabindex", "0");
                tabPanels[0].setAttribute("role", "tabpanel");

                //select first tab
                const firstTab = tabGroup.querySelectorAll(TABS_TABWRAPPER_SELECTOR)[0];
                firstTab.setAttribute("aria-selected", "true");
                firstTab.setAttribute("tabindex", "0");
            }
        };
    };

    // Event binding
    function _bind() {
        const tabs = document.querySelectorAll(TABS_TABWRAPPER_SELECTOR);
        //if any of the tabs are clicked run activateTab
        for (const tab of tabs) {
            tab.addEventListener("click", _activateTab);
            //this is what should work but support is shaky in testing
            tab.addEventListener("keydown", _handleKeyEvents);
        };
    };

    /* Event Handlers */

    function _handleKeyEvents(event) {

        if (!event) {
            event = window.event;
        }
        //ignore keys if modifiers are active
        if (helpers.keyModiferActive(event)) {
            return;
        }

        const code = event.key || event.charCode || event.keyCode;

        switch (code) {
            case "Left":
            case "ArrowLeft":
            case 37:
                // Key left
                _switchTab(this.previousElementSibling, event);
                break;
            case "Right":
            case "ArrowRight":
            case 39:
                // Key right
                _switchTab(this.nextElementSibling, event);
                break;
            case "Home":
            case 36:
                //Home key
                _switchTab(this.parentElement.firstElementChild, event);
                break;
            case "End":
            case 35:
                //End key
                _switchTab(this.parentElement.lastElementChild, event);
            default:
        }
    };

    /* Methods */

    function _switchTab(sibling, event) {
        //if there's no sibling object passed or it has no attribute, do nothing
        if (!sibling || !sibling.hasAttribute(TABS_TABWRAPPER_ATTR)) {
            return;
        }

        //set focus on the prev tab
        sibling.focus();
        sibling.click();
        event.preventDefault();
    };

    function _activateTab(event) {
        //check if there are any tab groups on the page
        const tabGroup = this.parentElement.parentElement;

        if (!tabGroup.hasAttribute(TABS_GROUP_ATTR)) {
            //Argh! Broken HTML
            throw "HTML does not contain correct data attribure for tab group. Documentation is at https://github.com/frontgirl/accessible-components";
        }

        //get currently selected tabs
        const currentTabs = _getCurrentTabs();

        //deselect previously clicked tab
        let oldTabPanelID;
        for (const childElement of this.parentElement.children) {
            if (childElement.hasAttribute("aria-selected")) {
                //store old tab for later
                oldTabPanelID = childElement.firstChild.getAttribute("href");
                //deselect
                childElement.removeAttribute("aria-selected");
                childElement.setAttribute("tabindex", "-1");
                break;
            }
        }

        //hide old tab panel
        const oldTabPanel = document.querySelector(oldTabPanelID);
        oldTabPanel.setAttribute("aria-hidden", "true");
        oldTabPanel.setAttribute("tabindex", "-1");

        //remove old tab ID from storage
        const tabIndex = currentTabs.indexOf(oldTabPanelID);
        if (tabIndex > -1) {
            currentTabs.splice(tabIndex, 1);
        }

        //select new clicked tab
        this.setAttribute("aria-selected", "true");
        this.setAttribute("tabindex", "0");

        //get new tab panel
        const newTabPanelID = this.firstChild.getAttribute("href");

        //get new tab
        const newTabPanel = document.querySelector(newTabPanelID);

        newTabPanel.setAttribute("aria-hidden", "false");
        newTabPanel.setAttribute("tabindex", "0");

        //add new tab to storage
        currentTabs.push(newTabPanelID);
        localStorage.setItem(_storageIndex, currentTabs.join());

        //prevent hash change
        event.preventDefault();
    };

    function _getCurrentTabs() {
        let currentTabs = [];
        const storedTabs = localStorage.getItem(_storageIndex);
        if (storedTabs) {
            currentTabs = storedTabs.split(",");
        }
        return currentTabs;
    };

    /* Public Methods */
    function init() {
        //if tab groups don't exist, go no further
        if (!document.querySelector(TABS_GROUP_SELECTOR)) {
            return;
        }
        _setup();
        _bind();
    };

    return {
        init
    };
};