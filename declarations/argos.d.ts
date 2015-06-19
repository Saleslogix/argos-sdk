/// <reference path="dojo.d.ts" />
declare function define(dependencies: String[], factory: Function): any;
declare function define(mid: String, dependencies: String[], factory: Function): any;
declare function require(config?: Object, dependencies?: String[], callback?: Function): any;

declare var Sage: any;
declare var Simplate: any;

declare module "snap" {
    var exp: any;
    export = exp;
}

declare var Mobile: any;
declare var Canvas2Image: any;
declare var ReUI: argos.ReUI;
declare var App: argos.Application;

interface Window {
    ReUI: any;
    reConfig: any;
    DocumentTouch: any;
    App: argos.Application;
    DeepDiff: any;
}

interface Function {
    bindDelegate: any;
}

declare module argos {
    interface ReUI {
        back: () => void;
        context: any;
        disableLocationCheck: () => void;
        show: (el: Node, transitionOptions: any) => void;
    }

    var Convert: any;
    var Format: any;
    var MainToolbar: any;
    var Edit: Edit

    module Fields {
        interface _Field {
        }

        interface BooleanField extends _Field {
        }

        interface DateField extends EditorField {
        }

        interface DecimalField extends TextField {
        }

        interface DurationField extends LookupField {
        }

        interface EditorField extends _Field {
        }

        interface HiddenField extends TextField {
        }

        interface LookupField extends _Field {
        }

        interface NoteField extends TextAreaField {
        }

        interface PhoneField extends TextField {
        }

        interface SelectField extends LookupField {
        }

        interface SignatureField extends EditorField {
        }

        interface TextAreaField extends TextField {
        }

        interface TextField extends _Field {
        }
    }

    module Groups {
        interface _GroupBySection {
        }

        interface DateTimeSection extends _GroupBySection {
        }

        interface GroupByValueSection extends _GroupBySection {
        }
    }

    module Store {
        interface SData {
            (options: any): void;
        }
    }

    module Views {
        interface ConfigureQuickActions extends _ConfigureBase {
            (): void;
        }

        interface FileSelect extends View {
        }

        interface Signature extends View {
        }
    }

    interface _ConfigureBase extends _ListBase {
    }

    interface _CustomizationMixin {
    }

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

    interface ErrorHandler {
        name: string,
        test: (err: any) => boolean,
        handle: (err: any, next: () => void) => void
    }

    interface _ErrorHandleMixin {
        errorText: {
            general: string,
            status: {}
        },

        HTTP_STATUS: {},

        errorHandlers: any[],

        createErrorHandlers: () => ErrorHandler[],

        handleError: (error: any) => void,

        getErrorMessage: (error: any) => string
    }

    interface _LegacySDataDetailMixin { }
    interface _LegacySDataEditMixin { }
    interface _LegacySDataListMixin { }

    interface _PullToRefreshMixin { }
    interface _RelatedViewWidgetBase { }
    interface _RelatedViewWidgetDetailMixin { }
    interface _RelatedViewWidgetEditMixin { }
    interface _RelatedViewWidgetListMixin { }

    interface _SDataDetailMixin { }
    interface _SDataEditMixin { }
    interface _SDataListMixin { }

    interface _Templated { }

    interface Edit extends _EditBase {
    }

    interface CalendarView extends View {
        getDateTime: () => Date;
    }

    interface _ActionMixin extends Function {
        hasAction: (name: string, evt?: any, el?: any) => boolean;
        invokeAction: (name: any, parameters: any, evt: any, el: any) => any;
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

    interface ApplicationModule { }
    interface Calendar { }
    interface ConfigurableSelectionModel extends Function {
        (): void
    }
    interface Convert {
        toBoolean: (value: string) => boolean;
        isDateString: (value: string) => boolean;
        toIsoStringFromDate: (value: Date) => string;
        toJsonStringFromDate: (value: Date) => string;
        toDateFromString: (value: string) => Date;
    }
    interface Detail { }

    interface ErrorManager {
        addError: (serverResponse, requestOptions, viewOptions?, failType?: string) => void;
    }
    interface FieldManager {
        register: (name: string, ctor: Function) => Function;
        get: (name: string) => Function;
    }
    interface Format {
        fixed: (val: number | string, d?: number) => number;
        date: (val: Date | string, fmt: string, utc?: boolean) => string;
        phone: (val: string, asLink?: boolean) => string;
        alphaToPhoneNumeric: (val: string) => string;
        imageFromVector: (vector: number[][]| string, options: any, html?: boolean) => any;
        canvasDraw: (vector: number[][], canvas: HTMLCanvasElement, options?: any) => void;
        encode: (val: string) => string;
        percent: (val: number | string, places: number | string) => string;
    }
    interface GroupedList { }
    interface List { }
    interface MainToolbar { }
    interface RelatedViewManager extends Function {
        (options?): void
    }
    interface RelatedViewWidget { }
    interface SearchWidget { }
    interface SelectionModel { }
    interface Toolbar { }
    interface Utility {
        escapeSearchQuery: (searchQuery: string) => string;
        memoize: (fn: (...args: any[]) => any, keyFn: (value) => string) => any;
        getValue: (o: any, name: string, defaultValue?: any) => any;
        setValue: (o: any, name: string, val: any) => any;
        expand: (scope: any, expression: Function | any) => any;
        roundNumberTo: (number: number, precision: number) => any;
        joinFields: (seperator: string, fields: string[]) => string;
        sanitizeForJson: (obj: any) => any;
    }
}

declare module "argos/_ActionMixin" {
    var exp: argos._ActionMixin;
    export = exp;
}

declare module "argos/_ConfigureBase" {
    var exp: argos._ConfigureBase;
    export = exp;
}

declare module "argos/_CustomizationMixin" {
    var exp: argos._CustomizationMixin;
    export = exp;
}

declare module "argos/_DetailBase" {
    var exp: argos._DetailBase;
    export = exp;
}

declare module "argos/_EditBase" {
    var exp: argos._EditBase;
    export = exp;
}

declare module "argos/_ErrorHandleMixin" {
    var exp: argos._ErrorHandleMixin;
    export = exp;
}

declare module "argos/_LegacySDataDetailMixin" {
    var exp: argos._LegacySDataDetailMixin;
    export = exp;
}

declare module "argos/_LegacySDataEditMixin" {
    var exp: argos._LegacySDataEditMixin;
    export = exp;
}

declare module "argos/_LegacySDataListMixin" {
    var exp: argos._LegacySDataListMixin;
    export = exp;
}

declare module "argos/_ListBase" {
    var exp: argos._ListBase;
    export = exp;
}

declare module "argos/_PullToRefreshMixin" {
    var exp: argos._PullToRefreshMixin;
    export = exp;
}

declare module "argos/_RelatedViewWidgetBase" {
    var exp: argos._RelatedViewWidgetBase;
    export = exp;
}

declare module "argos/_RelatedViewWidgetDetailMixin" {
    var exp: argos._RelatedViewWidgetDetailMixin;
    export = exp;
}

declare module "argos/_RelatedViewWidgetEditMixin" {
    var exp: argos._RelatedViewWidgetEditMixin;
    export = exp;
}

declare module "argos/_RelatedViewWidgetListMixin" {
    var exp: argos._RelatedViewWidgetListMixin;
    export = exp;
}

declare module "argos/_SDataDetailMixin" {
    var exp: argos._SDataDetailMixin;
    export = exp;
}

declare module "argos/_SDataEditMixin" {
    var exp: argos._SDataEditMixin;
    export = exp;
}

declare module "argos/_SDataListMixin" {
    var exp: argos._SDataListMixin;
    export = exp;
}

declare module "argos/_Templated" {
    var exp: argos._Templated;
    export = exp;
}

declare module "argos/Application" {
    var exp: argos.Application;
    export = exp;
}

declare module "argos/ApplicationModule" {
    var exp: argos.ApplicationModule;
    export = exp;
}

declare module "argos/Calendar" {
    var exp: argos.Calendar;
    export = exp;
}

declare module "argos/ConfigurableSelectionModel" {
    var exp: argos.ConfigurableSelectionModel;
    export = exp;
}

declare module "argos/Convert" {
    var exp: argos.Convert;
    export = exp;
}

declare module "argos/Detail" {
    var exp: argos.Detail;
    export = exp;
}

declare module "argos/Edit" {
    var exp: argos.Edit;
    export = exp;
}

declare module "argos/ErrorManager" {
    var exp: argos.ErrorManager;
    export = exp;
}

declare module "argos/FieldManager" {
    var exp: argos.FieldManager;
    export = exp;
}

declare module "argos/Format" {
    var exp: argos.Format;
    export = exp;
}

declare module "argos/GroupedList" {
    var exp: argos.GroupedList;
    export = exp;
}

declare module "argos/List" {
    var exp: argos.List;
    export = exp;
}

declare module "argos/MainToolbar" {
    var exp: argos.MainToolbar;
    export = exp;
}

declare module "argos/RelatedViewManager" {
    var exp: argos.RelatedViewManager;
    export = exp;
}

declare module "argos/RelatedViewWidget" {
    var exp: argos.RelatedViewWidget;
    export = exp;
}

declare module "argos/SearchWidget" {
    var exp: argos.SearchWidget;
    export = exp;
}

declare module "argos/SelectionModel" {
    var exp: argos.SelectionModel;
    export = exp;
}

declare module "argos/Toolbar" {
    var exp: argos.Toolbar;
    export = exp;
}

declare module "argos/Utility" {
    var exp: argos.Utility;
    export = exp;
}

declare module "argos/View" {
    var exp: argos.View;
    export = exp;
}

declare module "argos/Views/ConfigureQuickActions" {
    var exp: argos.Views.ConfigureQuickActions;
    export = exp;
}

declare module "argos/Views/FileSelect" {
    var exp: argos.Views.FileSelect;
    export = exp;
}

declare module "argos/Views/Signature" {
    var exp: argos.Views.Signature;
    export = exp;
}

declare module "argos/Store/SData" {
    var exp: argos.Store.SData;
    export = exp;
}

declare module "argos/Groups/_GroupBySection" {
    var exp: argos.Groups._GroupBySection;
    export = exp;
}

declare module "argos/Groups/DateTimeSection" {
    var exp: argos.Groups.DateTimeSection;
    export = exp;
}

declare module "argos/Groups/GroupByValueSection" {
    var exp: argos.Groups.GroupByValueSection;
    export = exp;
}

declare module "argos/Fields/_Field" {
    var exp: argos.Fields._Field;
    export = exp;
}

declare module "argos/Fields/BooleanField" {
    var exp: argos.Fields.BooleanField;
    export = exp;
}

declare module "argos/Fields/DateField" {
    var exp: argos.Fields.DateField;
    export = exp;
}

declare module "argos/Fields/DecimalField" {
    var exp: argos.Fields.DecimalField;
    export = exp;
}

declare module "argos/Fields/DurationField" {
    var exp: argos.Fields.DurationField;
    export = exp;
}

declare module "argos/Fields/EditorField" {
    var exp: argos.Fields.EditorField;
    export = exp;
}

declare module "argos/Fields/HiddenField" {
    var exp: argos.Fields.HiddenField;
    export = exp;
}

declare module "argos/Fields/LookupField" {
    var exp: argos.Fields.LookupField;
    export = exp;
}

declare module "argos/Fields/NoteField" {
    var exp: argos.Fields.NoteField;
    export = exp;
}

declare module "argos/Fields/PhoneField" {
    var exp: argos.Fields.PhoneField;
    export = exp;
}

declare module "argos/Fields/SelectField" {
    var exp: argos.Fields.SelectField;
    export = exp;
}

declare module "argos/Fields/SignatureField" {
    var exp: argos.Fields.SignatureField;
    export = exp;
}

declare module "argos/Fields/TextAreaField" {
    var exp: argos.Fields.TextAreaField;
    export = exp;
}

declare module "argos/Fields/TextField" {
    var exp: argos.Fields.TextField;
    export = exp;
}
