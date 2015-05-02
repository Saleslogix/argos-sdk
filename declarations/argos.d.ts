/// <reference path="dojo.d.ts" />

declare function define(dependencies: String[], factory: Function): any;
declare function define(mid: String, dependencies: String[], factory: Function): any;
declare function require(config?: Object, dependencies?: String[], callback?: Function): any;

declare var Sage: any;
declare var Simplate: any;

declare var ReUI: {
    back: () => void;
    context: any;
    disableLocationCheck: () => void;
    show: (el: Node, transitionOptions: any) => void;
};

declare var Mobile: any;
declare var Canvas2Image: any;
declare var App: Application;

declare var argos: {
    Convert: any;
    Edit: Edit;
    Format: any;
    MainToolbar: any;
};

interface View extends _ActionMixin, Function {
    show: any;
    set: any;
    id: string;
    expose: any;
    refreshRequired: any;
    refresh: any;
    clear: any;
    pageSize: any;
    layout: any;
    setLayout: any;
    options: any;
    get: any;
    getGroupForEntry: any;
    entry: any;

    currentDate: any; // more specific type
    icon: any;
    titleText: string;
    getSecurity: any;
}

interface _DetailBase extends View {
    
}

interface _ListBase extends View {
    getListCount: any;
    entries: any;
}

interface _EditBase extends View {
    hideValidationSummary: any;
    isValid?: any;
    createItem: any;
    getValues: any;
    showValidationSummary: () => void;
    validate: () => boolean;
}

interface Edit extends _EditBase {
}

interface _ActionMixin {
    hasAction: (name: string, evt?: any, el?: any) => boolean;
    invokeAction: (name:any, parameters:any, evt:any, el:any) => any;
}

 interface Application {
    enableConcurrencyCheck: boolean;
    getCustomizationsFor: (path: string, id?: string) => string;
    getViewSecurity: (key: string, access: string) => string;
    getView: <T extends View>(key: string) => T;

    hasAccessTo: (security: string) => boolean;
    isOnFirstView: () => boolean;
    bars: any;
    services: any;
    getServices: any;
    getService: any;
    getPrimaryActiveView: <T extends View>() => T;
    context: any;
    snapper: any;
    isOnline: any;
    enableCaching: any;
    hasView: any;
    queryNavigationContext: any;
    registerView: any;
    maxUploadFileSize: number;
    setPrimaryTitle: any;
    defaultService: any;
    getExposedViews: any;
    supportsTouch: () => boolean;
    initAppState: any;
    persistPreferences: any;
    preferences: any;
}

interface Window {
    ReUI: any;
    reConfig: any;
    DocumentTouch: any;
    App: Application;
    DeepDiff: any;
}

interface Function {
    bindDelegate: any;
}