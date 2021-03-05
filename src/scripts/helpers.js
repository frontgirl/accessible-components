//helpers
export default function helpers() {
    //hide/show an element using aria properties
    const setVisibility = (element, visible) => {
        element.setAttribute("aria-hidden", !visible);
    };
    const setExpandedState = (element, expanded) => {
        element.setAttribute("aria-expanded", !expanded);
    };
    const sanitiseRegEx = (s) => {
        return s.replace(/[-\\^$*+?.()|[\]{}]/g, "\\$&");
    };
    const keyModiferActive = (event) => {
        return event.altKey ||
            event.ctrlKey ||
            event.metaKey ||
            event.shiftKey;
    };

    const getUrlHashArray = () => {
        if (window.location.hash) {
            return window.location.hash.split('#').filter(hash => hash !== '');
        } else {
            return false;
        }
    };

    return {
        setVisibility,
        setExpandedState,
        sanitiseRegEx,
        keyModiferActive,
        getUrlHashArray
    };
};