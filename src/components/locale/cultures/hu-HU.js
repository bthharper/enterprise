/* eslint-disable no-bitwise, no-undef */

// Get Latest from http://www.unicode.org/Public/cldr/25/
Soho.Locale.addCulture('hu-HU', {
  // layout/language
  language: 'hu',
  englishName: 'Hungarian (Hungary)',
  nativeName: 'magyar (Magyarország)',
  // layout/orientation/@characters
  direction: 'left-to-right',
  // ca-gregorian
  calendars: [{
    name: 'gregorian',
    // ca-gregorian/main/dates/calendars/gregorian/dateFormats/
    dateFormat: {
      separator: '. ', // Infered
      timeSeparator: ':',
      short: 'yyyy. MM. dd.', // use four digit year
      medium: 'yyyy. MMM d.',
      long: 'yyyy. MMMM d.',
      full: 'yyyy. MMMM d., EEEE',
      month: 'MMMM d.',
      year: 'yyyy. MMMM',
      timestamp: 'H:mm:ss',
      datetime: 'yyyy. MM. dd. H:mm',
      timezone: 'yyyy. MM. dd. H:mm zz',
      timezoneLong: 'yyyy. MM. dd. H:mm zzzz'
    }, // Infered short + short gregorian/dateTimeFormats
    // ca-gregorian/main/dates/calendars/gregorian/days/format/short or abbreviated (2 digit)
    days: {
      wide: ['vasárnap', 'hétfő', 'kedd', 'szerda', 'csütörtök', 'péntek', 'szombat'],
      abbreviated: ['V', 'H', 'K', 'Sze', 'Cs', 'P', 'Szo'],
      narrow: ['V', 'H', 'K', 'Sz', 'Cs', 'P', 'Sz']
    },
    // ca-gregorian/main/dates/calendars/gregorian/months/format/wide
    months: {
      wide: ['január', 'február', 'március', 'április', 'május', 'június', 'július', 'augusztus', 'szeptember', 'október', 'november', 'december'],
      abbreviated: ['jan.', 'febr.', 'márc.', 'ápr.', 'máj.', 'jún.', 'júl.', 'aug.', 'szept.', 'okt.', 'nov.', 'dec.']
    },
    // ca-gregorian/main/dates/calendars/gregorian/timeFormats/short
    timeFormat: 'H:mm',
    // ca-gregorian/main/dates/calendars/gregorian/dayPeriods/wide
    dayPeriods: ['de.', 'du.']
  }],
  // numbers/currencyFormats-numberSystem-latn/standard
  currencySign: 'Ft',
  currencyFormat: '### ¤',
  // numbers/symbols-numberSystem-latn
  numbers: {
    percentSign: '%',
    percentFormat: '### %',
    minusSign: '-',
    decimal: ',',
    group: ' ',
    groupSizes: [3, 3]
  },
  // Resx - Provided By Translation Team
  messages: {
    AboutText: { id: 'AboutText', value: 'Copyright &copy; {0} Infor. Minden jog fenntartva. Az itt felsorolt szó- és ábrás megjelölések az Infor és/vagy kapcsolt vállalkozásainak és leányvállalatainak védjegyei és/vagy bejegyzett védjegyei. Minden jog fenntartva. Minden más felsorolt védjegy a védjegytulajdonos tulajdonát képezi.' },
    Actions: { id: 'Actions', value: 'Műveletek', comment: 'Tooltip text for the action button with additional in context actions' },
    AdditionalItems: { id: 'AdditionalItems', value: 'További elemek', comment: 'Button tooltip used in a list of movable items' },
    Add: { id: 'Add', value: 'Hozzáadás', comment: 'Add' },
    AddComments: { id: 'AddComments', value: 'Megjegyzések hozzáfűzése', comment: 'Add comments to a form of data' },
    AddNewTab: { id: 'AddNewTab', value: 'Új lap hozzáadása', comment: 'Attached to a button that adds new tabs' },
    AdministrativeLeave: { id: 'AdministrativeLeave', value: 'Fizetett szabadság', comment: 'As in vacation time from work' },
    AdvancedFilter: { id: 'AdvancedFilter', value: 'Irányított szűrő létrehozása', comment: 'In a data grid active an advanced filtering feature' },
    Alert: { id: 'Alert', value: 'Figyelmeztetés', comment: 'Alert' },
    AlertOnPage: { id: 'AlertOnPage', value: 'Figyelmeztető üzenet(ek) ezen az oldalon:', comment: 'Alert message(s) on page n' },
    All: { id: 'All', value: 'Összes', comment: 'All items in the context of a filter' },
    AllResults: { id: 'AllResults', value: 'Minden találat erre:', comment: 'Search Results Text' },
    AligntoBottom: { id: 'AligntoBottom', value: 'Alulra igazítás', comment: 'Align to Bottom tooltip' },
    AlignCenterHorizontally: { id: 'AlignCenterHorizontally', value: 'Középre igazítás vízszintesen', comment: 'Align Center Horizontally tooltip' },
    Amber: { id: 'Amber', value: 'Borostyánsárga', comment: 'Color in our color pallette' },
    Amethyst: { id: 'Amethyst', value: 'Ametisztlila', comment: 'Color in our color pallette' },
    Apply: { id: 'Apply', value: 'Alkalmazás', comment: 'Text in a button to apply an action' },
    AppMenuTriggerText: { id: 'AppMenuTriggerText', value: 'Menü', comment: 'Text in a special Module Tab used to trigger an Application Menu open or closed' },
    Attach: { id: 'Attach', value: 'Csatolás', comment: 'Attach' },
    Available: { id: 'Available', value: 'Elérhető', comment: 'Button tooltip used in a list of movable items' },
    Azure: { id: 'Azure', value: 'Azúrkék', comment: 'Color in our color pallette' },
    BackgroundColor: { id: 'BackgroundColor', value: 'Háttérszín', comment: 'add or edit text background color in the editor' },
    Between: { id: 'Between', value: 'Közötti', comment: 'Between in icons for filtering' },
    Blockquote: { id: 'Blockquote', value: 'Idézetblokk', comment: 'insert a block quote in the editor' },
    Bold: { id: 'Bold', value: 'Félkövér', comment: 'Make text Bold' },
    Bookmarked: { id: 'Bookmarked', value: 'Könyvjelzővel jelölt', comment: 'Bookmark filled - Element is already bookmarked' },
    BookmarkThis: { id: 'BookmarkThis', value: 'Könyvjelzővel jelölés', comment: 'Bookmark an element' },
    Breadcrumb: { id: 'Breadcrumb', value: 'Útkövetés', comment: 'Text describing the Breadcrumb' },
    Browser: { id: 'Browser', value: 'Böngésző', comment: 'As in a Web Browser' },
    BulletedList: { id: 'BulletedList', value: 'Listajeles felsorolás', comment: 'Bulleted List tooltip' },
    Calendar: { id: 'Calendar', value: 'Naptár', comment: 'Inline Text for the title of the Calendar control' },
    Camera: { id: 'Camera', value: 'Kamera', comment: 'Camera tooltip' },
    Cancel: { id: 'Cancel', value: 'Mégse', comment: 'Cancel tooltip' },
    CapsLockOn: { id: 'CapsLockOn', value: 'Caps Lock bekapcsolva', comment: 'Caps Lock On message' },
    Cart: { id: 'Cart', value: 'Kosár', comment: 'Cart tooltip' },
    CenterText: { id: 'CenterText', value: 'Középre', comment: 'An Icon Tooltip' },
    CharactersLeft: { id: 'CharactersLeft', value: 'Felhasználható karakterek száma: {0}', comment: 'indicator showing how many more characters you can type.' },
    CharactersMax: { id: 'CharactersMax', value: 'Maximális karakterszám: ', comment: 'indicator showing how many max characters you can type.' },
    ChangeSelection: { id: 'ChangeSelection', value: '. A kijelölést a nyílbillentyűkkel módosíthatja.', comment: 'Audible Text for drop down list help' },
    ChangeView: { id: 'ChangeView', value: 'Nézetváltás', comment: 'Change the current page from a list of options' },
    Checkbox: { id: 'Checkbox', value: 'Jelölőnégyzet', comment: 'Checkbox tooltip' },
    Checked: { id: 'Checked', value: 'Bejelölve', comment: 'Checked tooltip' },
    Clear: { id: 'Clear', value: 'Törlés', comment: 'Tooltip for a Clear Action' },
    ClearFilter: { id: 'ClearFilter', value: 'Szűrő törlése', comment: 'Clear the current filter criteria' },
    ClearFormatting: { id: 'ClearFormatting', value: 'Formázás törlése', comment: 'Clear the formatting in editor' },
    ClearSelection: { id: 'ClearSelection', value: '(Kijelölés törlése)', comment: 'clear dropdown selection' },
    Clock: { id: 'Clock', value: 'Óra', comment: 'Clock tooltip' },
    Close: { id: 'Close', value: 'Bezárás', comment: 'Tooltip for a Close Button Action' },
    Clickable: { id: 'Clickable', value: 'Szerkesztőben kattintható', comment: 'Clickable in editor' },
    Copy: { id: 'Copy', value: 'Másolás', comment: 'Copy tooltip' },
    Collapse: { id: 'Collapse', value: 'Összecsukás', comment: 'Collapse / close a tree/submenu' },
    CollapseAppTray: { id: 'CollapseAppTray', value: 'Alkalmazástálca összecsukása', comment: 'Collapse App Tray tooltip' },
    Columns: { id: 'Columns', value: 'Oszlopok', comment: 'Columns tooltip' },
    Comments: { id: 'Comments', value: 'Megjegyzések', comment: 'Comments on an form' },
    CompanyHoliday: { id: 'CompanyHoliday', value: 'Vállalati szabadság', comment: 'A holiday provided by work.' },
    Component: { id: 'Component', value: 'Összetevő', comment: 'As in a UI component - building block.' },
    Compose: { id: 'Compose', value: 'Levélírás', comment: 'Compose tooltip' },
    Completed: { id: 'Completed', value: 'Befejezve', comment: 'Text For a Completed Status' },
    Confirm: { id: 'Confirm', value: 'Megerősítés', comment: 'Confirm tooltip' },
    ConfirmOnPage: { id: 'ConfirmOnPage', value: 'Üzenet(ek) megerősítése ezen az oldalon:', comment: 'Confirm message(s) on page n' },
    CookiesEnabled: { id: 'CookiesEnabled', value: 'Cookie-k engedélyezve', comment: 'Returns if browser cookies are enabled or not.' },
    Contains: { id: 'Contains', value: 'Tartalmazza', comment: 'Contains in icons for filtering' },
    CssClass: { id: 'CssClass', value: 'CSS-osztály', comment: 'Label for entering a Css Class name' },
    Cut: { id: 'Cut', value: 'Kivágás', comment: 'Cut tooltip' },
    Date: { id: 'Date', value: 'Dátum', comment: 'Describes filtering by a date data type' },
    Day: { id: 'Day', value: 'Nap', comment: 'Shows view with day events' },
    Days: { id: 'Days', value: 'Nap ', comment: 'Show how many days until an event' },
    DaysOverdue: { id: 'DaysOverdue', value: '{0} napja késedelmes', comment: 'For a task /date UI' },
    DaysRemaining: { id: 'DaysRemaining', value: '{0} nap van hátra', comment: 'For a task /date UI' },
    Delete: { id: 'Delete', value: 'Törlés', comment: 'Delete Toolbar Action Tooltip' },
    DeviceName: { id: 'Device', value: 'Eszköz', comment: 'Name of the Device' },
    DistributeHoriz: { id: 'DistributeHoriz', value: 'Vízszintes elosztás', comment: 'Icon button tooltip for action that distributes elements across Horizontally' },
    Document: { id: 'Document', value: 'Dokumentum', comment: 'Document tooltip' },
    DiscretionaryTimeOff: { id: 'DiscretionaryTimeOff', value: 'Jutalomszabadság', comment: 'As in work time off' },
    Dirty: { id: 'Dirty', value: 'A sor megváltozott', comment: 'Record is dirty / modified' },
    Drilldown: { id: 'Drilldown', value: 'Lefúrás', comment: 'Drill by moving page flow into a record' },
    Drillup: { id: 'Drillup', value: 'Felfúrás', comment: 'Opposite of Drilldown, move back up to a larger set of records' },
    Dropdown: { id: 'Dropdown', value: 'Legördülő', comment: 'Dropdown' },
    DoesNotContain: { id: 'DoesNotContain', value: 'Nem tartalmazza', comment: 'Does Not Contain in icons for filtering' },
    DoesNotEndWith: { id: 'DoesNotEndWith', value: 'Nem erre végződik', comment: 'For condition filtering' },
    DoesNotEqual: { id: 'DoesNotEqual', value: 'Nem egyenlő', comment: 'Does Not Equal in icons for filtering' },
    DoesNotStartWith: { id: 'DoesNotStartWith', value: 'Nem ezzel kezdődik', comment: 'For condition filtering' },
    Down: { id: 'Down', value: 'Le', comment: 'Down tooltip' },
    Download: { id: 'Download', value: 'Letöltés', comment: 'Download tooltip' },
    Duplicate: { id: 'Duplicate', value: 'Duplikálás', comment: 'Duplicate tooltip' },
    EitherSelectedOrNotSelected: { id: 'EitherSelectedOrNotSelected', value: 'Kiválasztott vagy nem kiválasztott', comment: 'Either Selected Or NotSelected in icons for filtering' },
    EndsWith: { id: 'EndsWith', value: 'Vége', comment: 'for condition filtering' },
    EnterComments: { id: 'EnterComments', value: 'Írja ide a megjegyzéseket…', comment: 'Placeholder text for a text input (comments)' },
    Error: { id: 'Error', value: 'Hiba', comment: 'Title, Spoken Text describing fact an error has occured' },
    ErrorAllowedTypes: { id: 'ErrorAllowedTypes', value: 'A fájltípus használata nem megengedett', comment: 'Error string for file-upload' },
    ErrorMaxFileSize: { id: 'ErrorMaxFileSize', value: 'Túllépte a maximális fájlméretet', comment: 'Error string for file-upload' },
    ErrorMaxFilesInProcess: { id: 'ErrorMaxFilesInProcess', value: 'Túllépte a fájlok megengedett maximális számát', comment: 'Error string for file-upload' },
    ErrorOnPage: { id: 'ErrorOnPage', value: 'Hibaüzenet(ek) ezen az oldalon:', comment: 'Error message(s) on page n' },
    EmailValidation: { id: 'EmailValidation', value: 'Érvénytelen e-mail cím', comment: 'This the rule for email validation' },
    Emerald: { id: 'Emerald', value: 'Smaragdzöld', comment: 'Color in our color pallette' },
    Expand: { id: 'Expand', value: 'Kibontás', comment: 'Expand open a tree/submenu' },
    ExpandAppTray: { id: 'ExpandAppTray', value: 'Alkalmazástálca kibontása', comment: 'ExpandAppTray tooltip' },
    ExpandCollapse: { id: 'ExpandCollapse', value: 'Kibontás/összecsukás', comment: 'Text to toggle a button in a container.' },
    ExportAsSpreadsheet: { id: 'ExportAsSpreadsheet', value: 'Exportálás táblázatként', comment: 'Export as Spreadsheet tooltip' },
    Edit: { id: 'Edit', value: 'Szerkesztés', comment: 'Edit tooltip' },
    Equals: { id: 'Equals', value: 'Egyenlő', comment: 'Equals in icons for filtering' },
    Event: { id: 'Event', value: 'Esemény', comment: 'As in an event that would be in a calendar' },
    ExitFullView: { id: 'ExitFullView', value: 'Kilépés a teljes nézetből', comment: 'Exit Full View tooltip' },
    Export: { id: 'Export', value: 'Exportálás', comment: 'Export tooltip' },
    ExportToExcel: { id: 'ExportToExcel', value: 'Exportálás Excelbe', comment: 'Export To Excel menu option in datagrid' },
    Favorite: { id: 'Favorite', value: 'Kedvenc', comment: 'A favorite item' },
    FileUpload: { id: 'FileUpload', value: 'Fájlfeltöltés: az Enter billentyűt megnyomva tallózással megkeresheti a kívánt fájlt', comment: 'Screen Reader instructions' },
    FieldFilter: { id: 'FieldFilter', value: 'Mezőszűrő', comment: 'Used for Field Filter' },
    Filter: { id: 'Filter', value: 'Szűrés', comment: 'Filter tooltip' },
    FirstPage: { id: 'FirstPage', value: 'Első oldal', comment: 'First Page tooltip' },
    Folder: { id: 'Folder', value: 'Mappa', comment: 'Folder tooltip' },
    From: { id: 'From', value: 'Kezdő dátum', comment: 'Start of a range (of dates)' },
    FullView: { id: 'FullView', value: 'Teljes nézet', comment: 'Full View tooltip' },
    GoForward: { id: 'GoForward', value: 'Előre', comment: 'Move Page / object this direction' },
    GoBack: { id: 'GoBack', value: 'Vissza', comment: 'Move Page / object this directionp' },
    GoDown: { id: 'GoDown', value: 'Lefelé', comment: 'Move Page / object this directionp' },
    GoUp: { id: 'GoUp', value: 'Felfelé', comment: 'Move Page / object this direction' },
    Go: { id: 'Go', value: 'Indítás', comment: 'Go, perform a movement, start a search, move to the next "thing" in a workflow.' },
    Graphite: { id: 'Graphite', value: 'Grafitszürke', comment: 'Color in our color pallette' },
    GreaterOrEquals: { id: 'GreaterOrEquals', value: 'Nagyobb vagy egyenlő', comment: 'Greater Than Or Equals in icons for filtering' },
    GreaterThan: { id: 'GreaterThan', value: 'Nagyobb, mint', comment: 'Greater Than in icons for filtering' },
    Grid: { id: 'Grid', value: 'Rács', comment: 'Grid tooltip' },
    Hour: { id: 'Hour', value: 'Óra', comment: 'the hour portion of a time' },
    Hours: { id: 'Hours', value: 'Óra', comment: 'the hour portion of a time (plural)' },
    HeadingThree: { id: 'HeadingThree', value: 'Harmadik címsor', comment: 'Heading Three tooltip' },
    HeadingFour: { id: 'HeadingFour', value: 'Negyedik címsor', comment: 'Heading Four tooltip' },
    Highest: { id: 'Highest', value: 'Legnagyobb', comment: 'Highest Four tooltip' },
    Home: { id: 'Home', value: 'Kezdőlap', comment: 'Home tooltip' },
    HtmlView: { id: 'HtmlView', value: 'HTML nézet', comment: 'Html View tooltip' },
    Image: { id: 'Image', value: 'Kép', comment: 'Image of something' },
    Import: { id: 'Import', value: 'Importálás', comment: 'Import tooltip' },
    Info: { id: 'Info', value: 'Információk', comment: 'Info tooltip' },
    InfoOnPage: { id: 'InfoOnPage', value: 'Tájékoztató üzenet(ek) ezen az oldalon:', comment: 'Information message(s) on page n' },
    InProgress: { id: 'In Progress', value: 'Folyamatban', comment: 'Info tooltip that an action is in progress' },
    Insert: { id: 'Insert', value: 'Beszúrás', comment: 'Insert Modal Dialog Button' },
    InsertAnchor: { id: 'InsertAnchor', value: 'Horgony beszúrása', comment: 'Insert Acnhor (link) in an editor' },
    InsertImage: { id: 'InsertImage', value: 'Kép beszúrása', comment: 'Insert Image in an editor' },
    InsertLink: { id: 'InsertLink', value: 'Hivatkozás beszúrása', comment: 'Insert Link in an editor' },
    InsertUrl: { id: 'InsertUrl', value: 'URL-cím beszúrása', comment: 'Insert a Url in an editor' },
    Italic: { id: 'Italic', value: 'Dőlt', comment: 'Make Text Italic' },
    InvalidDate: { id: 'InvalidDate', value: 'Érvénytelen dátum', comment: 'validation message for wrong date format (short)' },
    InvalidTime: { id: 'InvalidTime', value: 'Az időpont érvénytelen', comment: 'validation message for wrong time format' },
    Inventory: { id: 'Inventory', value: 'Készlet', comment: 'Icon button tooltop for Inventory Action' },
    InRange: { id: 'InRange', value: 'Tartományon belüli', comment: 'In Range in icons for filtering' },
    IsEmpty: { id: 'IsEmpty', value: 'Üres', comment: 'Is Empty in icons for filtering' },
    IsNotEmpty: { id: 'IsNotEmpty', value: 'Nem üres', comment: 'Is Not Empty in icons for filtering' },
    ItemsSelected: { id: 'ItemsSelected', value: 'Kiválasztott elemek', comment: 'Num of Items selected for swaplist' },
    JustifyCenter: { id: 'JustifyCenter', value: 'Középre', comment: 'justify text to center in the editor' },
    JustifyLeft: { id: 'JustifyLeft', value: 'Balra igazítás', comment: 'justify text to left in the editor' },
    JustifyRight: { id: 'JustifyRight', value: 'Jobbra igazítás', comment: 'justify text to right in the editor' },
    Keyword: { id: 'Keyword', value: 'Kulcsszó', comment: 'Describes filtering by a keyword search' },
    Launch: { id: 'Launch', value: 'Indítás', comment: 'Launch' },
    LastPage: { id: 'LastPage', value: 'Utolsó oldal', comment: 'Last Page tooltip' },
    Left: { id: 'Left', value: 'Balra', comment: 'Left tooltip' },
    Legend: { id: 'Legend', value: 'Jelmagyarázat', comment: 'As in a chart legend' },
    LessOrEquals: { id: 'LessOrEquals', value: 'Kisebb vagy egyenlő', comment: 'Less Than Or Equals in icons for filtering' },
    LessThan: { id: 'LessThan', value: 'Kisebb, mint', comment: 'Less Than in icons for filtering' },
    Link: { id: 'Link', value: 'Hivatkozás', comment: 'Link - as in hyperlink - icon tooltop' },
    Load: { id: 'Load', value: 'Betöltés', comment: 'Load icon tooltip' },
    Loading: { id: 'Loading', value: 'Betöltés', comment: 'Text below spinning indicator to indicate loading' },
    Locale: { id: 'Locale', value: 'Területi beállítás', comment: 'The users locale string for example en-US, it-It' },
    Locked: { id: 'Locked', value: 'Zárolt', comment: 'Locked tooltip' },
    Logout: { id: 'Logout', value: 'Kijelentkezés', comment: 'Log out of the application' },
    Lookup: { id: 'Lookup', value: 'Keresés', comment: 'Lookup - As in looking up a record or value' },
    Lowest: { id: 'Lowest', value: 'Legkisebb', comment: 'Lowest - As in Lowest value' },
    Mail: { id: 'Mail', value: 'Levél', comment: 'Mail tooltip' },
    MapPin: { id: 'MapPin', value: 'PIN', comment: 'Map Pin tooltip' },
    Maximize: { id: 'Maximize', value: 'Teljes méret', comment: 'Maximize a screen or dialog in the UI' },
    Median: { id: 'Median', value: 'Medián', comment: 'Median in Mathematics' },
    Medium: { id: 'Medium', value: 'Közepes', comment: 'Describes a Medium sized Row Height in a grid/list' },
    Menu: { id: 'Menu', value: 'Menü', comment: 'Menu tooltip' },
    MingleShare: { id: 'MingleShare', value: 'Megosztás a Ming.le rendszerben', comment: 'Share the contextual object/action in the mingle system' },
    Minutes: { id: 'Minutes', value: 'Perc', comment: 'the minutes portion of a time' },
    Minimize: { id: 'Minimize', value: 'Kis méret', comment: 'Minimize tooltip' },
    Minus: { id: 'Minus', value: 'Mínusz', comment: 'Minus tooltip' },
    Mobile: { id: 'Mobile', value: 'Mobil', comment: 'Indicates a mobile device (phone tablet ect)' },
    Month: { id: 'Month', value: 'Hónap', comment: 'As in a date month' },
    More: { id: 'More', value: 'Továbbiak...', comment: 'Text Indicating More Buttons or form content' },
    MoreActions: { id: 'MoreActions', value: 'További műveletek', comment: 'Text on the More Actions button indictating hidden functions' },
    MoveToLeft: { id: 'MoveToLeft', value: 'Mozgatás balra', comment: 'Button tooltip used in a list of movable items' },
    MoveToRight: { id: 'MoveToRight', value: 'Mozgatás jobbra', comment: 'Button tooltip used in a list of movable items' },
    MsgDirty: { id: 'MsgDirty', value: ', módosítva', comment: 'for modified form fields' },
    New: { id: 'New', value: 'Új', comment: 'Add new rowstatus in datagrid' },
    NewDocument: { id: 'NewDocument', value: 'Új dokumentum', comment: 'New Document tooltip' },
    NewItem: { id: 'NewItem', value: 'Új elem', comment: 'New item in listbuilder' },
    NewWindow: { id: 'NewWindow', value: 'Új ablak', comment: 'Contents open in a new browser window.' },
    Next: { id: 'Next', value: 'Következő', comment: 'Next in icons tooltip' },
    NextPage: { id: 'NextPage', value: 'Következő oldal', comment: 'Next on Pager' },
    NextMonth: { id: 'NextMonth', value: 'Következő hónap', comment: 'the label for the button that moves calendar to next/prev' },
    No: { id: 'No', value: 'Nem', comment: 'On a dialog button' },
    NoData: { id: 'NoData', value: 'Nincs elérhető adat', comment: 'Shown when there is no rows shown in a list' },
    NoDataFilter: { id: 'NoDataFilter', value: 'Nincs elérhető adat. Több eredmény megjelenítéséhez válasszon új szűrőt.', comment: 'Shown when there is no rows shown in a list' },
    NoDataList: { id: 'NoDataList', value: 'Nincs elérhető adat. Több eredmény megjelenítéséhez válasszon a fenti listából.', comment: 'Shown when there is no rows shown in a list' },
    None: { id: 'None', value: 'Nincs', comment: 'None to pick clear color' },
    NoResults: { id: 'NoResults', value: 'Nincs eredmény', comment: 'Search Results Text' },
    Normal: { id: 'Normal', value: 'Normál', comment: 'Normal row height' },
    Notes: { id: 'Notes', value: 'Jegyzetek', comment: 'Notes icon tooltip' },
    NotSelected: { id: 'NotSelected', value: 'Nem kiválasztott', comment: 'Not Selected in icons for filtering' },
    NumberList: { id: 'NumberList', value: 'Számozott lista', comment: 'Number List tooltip' },
    Ok: { id: 'Ok', value: 'OK', comment: 'Ok button on a dialog' },
    OpenBackClose: { id: 'OpenBackClose', value: 'Megnyitás / Vissza / Bezárás', comment: 'Open / Back / Close tooltip' },
    OpenClose: { id: 'OpenClose', value: 'Megnyitás / Bezárás', comment: 'Open / Close tooltip' },
    OperatingSystem: { id: 'OperatingSystem', value: 'Operációs rendszer', comment: 'Device Operating System' },
    OrderedList: { id: 'OrderedList', value: 'Számozott felsorolás beszúrása/eltávolítása', comment: 'Insert an Ordered list in the editor' },
    Page: { id: 'Page', value: 'oldal ', comment: 'Text on the pager links' },
    PageOf: { id: 'PageOf', value: '{0}./{1} oldal', comment: 'Pager Text Showing current and number of pages' },
    PageOn: { id: 'PageOn', value: 'Jelenleg ezen az oldalon van: ', comment: 'Text on the pager links' },
    PaidTimeOff: { id: 'PaidTimeOff', value: 'Fizetett szabadság', comment: 'As in vacation from work' },
    Paste: { id: 'Paste', value: 'Beszúrás', comment: 'Paste icon tooltip' },
    PasswordValidation: { id: 'PasswordValidation', value: '<strong>A jelszó:</strong><br>legalább 10 karakterből álljon,<br>tartalmazzon legalább egy nagybetűt,<br>tartalmazzon legalább egy kisbetűt,<br>tartalmazzon legalább egy speciális karaktert,<br>nem tartalmazhatja a felhasználónevet,<br>nem lehet korábban már használt jelszó.<br>', comment: 'Password validation requirements' },
    PasswordConfirmValidation: { id: 'PasswordConfirmValidation', value: 'A jelszónak és a jelszó megerősítésének egyeznie kell', comment: 'Password Confirm validation' },
    Peak: { id: 'Peak', value: 'Csúcsérték', comment: 'the max or peak value in a chart' },
    Pending: { id: 'Pending', value: 'Függőben', comment: 'An event or task is pending' },
    PersonalizeColumns: { id: 'PersonalizeColumns', value: 'Oszlopok testreszabása', comment: 'Customize Columns in a Grid' },
    Plan: { id: 'Plan', value: 'Terv', comment: 'As in type of vacation plan' },
    Platform: { id: 'Platform', value: 'Platform', comment: 'The users operating system i.e. mac, windows' },
    Period: { id: 'Period', value: 'Napszak', comment: 'the am/pm portion of a time' },
    PressDown: { id: 'PressDown', value: 'A dátum kiválasztásához nyomja meg a lefelé mutató nyilat', comment: 'the audible label for Tooltip about how to operate the date picker' },
    PressShiftF10: { id: 'PressShiftF10', value: 'A helyi menü megnyitásához nyomja meg a Shift+F10 billentyűkombinációt.', comment: 'the audible infor for screen readers on how to use a field with a popup menu' },
    Previous: { id: 'Previous', value: 'Előző', comment: 'Previous icon tooltip - moved to previous record' },
    PreviousMonth: { id: 'PreviousMonth', value: 'Előző hónap', comment: 'the label for the button that moves calendar to next/prev' },
    PreviousPage: { id: 'PreviousPage', value: 'Előző oldal', comment: 'Previous Page tooltip' },
    Print: { id: 'Print', value: 'Nyomtatás', comment: 'Print tooltip' },
    Range: { id: 'Range', value: 'Tartomány', comment: 'Range for tooltip' },
    RecordsPerPage: { id: 'RecordsPerPage', value: '{0} rekord oldalanként', comment: 'Dropdown allows the user to select how many visible records {} shows select value.' },
    Redo: { id: 'Redo', value: 'Mégis', comment: 'Redo tooltip' },
    ReorderRows: { id: 'ReorderRows', value: 'Sorok újrarendezése', comment: 'Drag and Reorder Grid Rows' },
    Refresh: { id: 'Refresh', value: 'Frissítés', comment: 'Refresh tooltip' },
    RequestTimeOff: { id: 'RequestTimeOff', value: 'Szabadságkérés', comment: 'Making a request for time off work.' },
    Required: { id: 'Required', value: 'Kötelező', comment: 'indicates a form field is manditory' },
    Reset: { id: 'Reset', value: 'Visszaállítás', comment: 'Reset tooltip' },
    ResetDefault: { id: 'ResetDefault', value: 'Alapértelmezett beállítások visszaállítása', comment: 'Reset Datagrid Columns, Filter and other Layout' },
    Result: { id: 'Result', value: 'Eredmény', comment: 'Showing a single result in a List' },
    Results: { id: 'Results', value: 'Eredmények', comment: 'As in showing N Results (plural) in a List' },
    RightAlign: { id: 'RightAlign', value: 'Jobbra igazítás', comment: 'Right Align tooltip' },
    RightAlignText: { id: 'RightAlignText', value: 'Jobbra igazítás', comment: 'Right Align Text tooltip' },
    Right: { id: 'Right', value: 'Jobbra', comment: 'Right' },
    Roles: { id: 'Roles', value: 'Szerepek', comment: 'Roles tooltip' },
    RowHeight: { id: 'RowHeight', value: 'Sormagasság', comment: 'Describes the Height for Rows in a Data Grid' },
    Ruby: { id: 'Ruby', value: 'Rubinvörös', comment: 'Color in our color pallette' },
    RunFilter: { id: 'RunFilter', value: 'Szűrő futtatása', comment: 'Execute the current filter criteria' },
    SameWindow: { id: 'SameWindow', value: 'Ugyanaz az ablak', comment: 'Contents open in the same browser window.' },
    Save: { id: 'Save', value: 'Mentés', comment: 'Save tooltip' },
    SaveCurrentView: { id: 'SaveCurrentView', value: 'Aktuális nézet mentése', comment: 'Datagrids contain view sets. This menu option saves them' },
    SavedViews: { id: 'SavedViews', value: 'Nézetek mentése', comment: 'Label for a list of Views' },
    Schedule: { id: 'Schedule', value: 'Ütemezés', comment: 'Shows a schedule view' },
    Seconds: { id: 'Seconds', value: 'Másodperc', comment: 'the seconds portion of a time' },
    Search: { id: 'Search', value: 'Keresés', comment: 'Search tooltip' },
    SearchColumnName: { id: 'SearchColumnName', value: 'Oszlopnév keresése', comment: 'Search for a datagrid column by name' },
    SearchFolder: { id: 'SearchFolder', value: 'Keresés a mappában', comment: 'Search Folder tooltip' },
    SearchList: { id: 'SearchList', value: 'Keresés a listán', comment: 'Search List tooltip' },
    Select: { id: 'Select', value: 'Kiválasztás', comment: 'text describing a select action' },
    SelectDay: { id: 'SelectDay', value: 'Nap kiválasztása', comment: 'Select a day in the calendar picker' },
    Selected: { id: 'Selected', value: 'Kiválasztva', comment: 'text describing a selected object' },
    SelectAll: { id: 'SelectAll', value: 'Mindet kiválasztja', comment: 'describes the action of selecting all items available in a list' },
    Send: { id: 'Send', value: 'Küldés', comment: 'Send tooltip' },
    SetTime: { id: 'SetTime', value: 'Idő beállítása', comment: 'button text that inserts time when clicked' },
    Settings: { id: 'Settings', value: 'Beállítások', comment: 'Settings tooltip' },
    Short: { id: 'Short', value: 'Rövid', comment: 'Describes a Shorted Row Height in a grid/list' },
    ShowFilterRow: { id: 'ShowFilterRow', value: 'Szűrősor mutatása', comment: 'Toggle a row with filer info above a list' },
    ShowLess: { id: 'ShowLess', value: 'Kevesebb megjelenítése', comment: 'Show less form content' },
    ShowMore: { id: 'ShowMore', value: 'Több megjelenítése', comment: 'Show more form content' },
    SickTime: { id: 'SickTime', value: 'Betegszabadság', comment: 'Time off sick from work' },
    Slate: { id: 'Slate', value: 'Palaszürke', comment: 'Color in our color pallette' },
    SlideOf: { id: 'SlideOf', value: '{1}/{0}. dia', comment: 'Slide Text Showing current and total number of slides' },
    SlidesOf: { id: 'SlidesOf', value: '{2}/{0}. és {1}. dia', comment: 'Slides Text Showing current slides and total number of slides' },
    SliderHandle: { id: 'SliderHandle', value: 'Leíró ehhez:', comment: 'Description of the portion of a Slider control that is focusable and changes its value, followed in code by the name of the control' },
    SliderMaximumHandle: { id: 'SliderMaximumHandle', value: 'A maximális tartományérték leírója ennél:', comment: 'Describes a maximum value handle in a Range (double slider), followed in code by the name of the control' },
    SliderMinimumHandle: { id: 'SliderMinimumHandle', value: 'A minimális tartományérték leírója ennél:', comment: 'Describes a minimum value handle in a Range (double slider), followed in code by the name of the control' },
    SkipToMain: { id: 'SkipToMain', value: 'Ugrás a fő tartalomra', comment: 'Skip link in header, jumps when clicked on to main area' },
    Status: { id: 'Status', value: 'Állapot', comment: 'Status of someting thats submitted fx in progress, approved' },
    StartsWith: { id: 'StartsWith', value: 'Kezdete', comment: 'for condition filtering' },
    StepsCompleted: { id: 'StepsCompleted', value: '{1}/{0}. lépés befejezve', comment: 'steps of a wizard/chart' },
    StrikeThrough: { id: 'StrikeThrough', value: 'Áthúzás', comment: 'turn on and off strike through text in text editor (like word)' },
    SortAtoZ: { id: 'SortAtoZ', value: 'Növekvő sorrendbe rendezés', comment: 'Sort A to Z in icons for filtering' },
    SortZtoA: { id: 'SortZtoA', value: 'Csökkenő sorrendbe rendezés', comment: 'Sort Z to A in icons for filtering' },
    SortDown: { id: 'SortDown', value: 'Csökkenő sorrendbe', comment: 'Sort Down tooltip' },
    SortUp: { id: 'SortUp', value: 'Növekvő sorrendbe', comment: 'Sort Up tooltip' },
    Subscript: { id: 'Subscript', value: 'Alsó index', comment: 'Turn on and off Subscript text in text editor (like word)' },
    Superscript: { id: 'Superscript', value: 'Felső index', comment: 'Turn on and off Superscript text in text editor (like word)' },
    Tabs: { id: 'Tabs', value: 'tabulátor...', comment: 'Used in the Tabs Control\'s more menu, preceeded by a number that describes how many tabs are in the spillover menu' },
    Tack: { id: 'Tack', value: 'PIN', comment: 'Pin an object' },
    Tall: { id: 'Tall', value: 'Magas', comment: 'Describes a Taller Row Height in a grid/list' },
    Target: { id: 'Target', value: 'Cél', comment: 'Label for an input to enter a Target (Url Attribute)' },
    TeamEvent: { id: 'TeamEvent', value: 'Csapatesemény', comment: 'Having an event with a work team' },
    TestLocaleDefaults: { id: 'TestLocaleDefaults', value: 'Test Locale Defaults', comment: 'Do not translate' },
    TextColor: { id: 'TextColor', value: 'Szövegszín', comment: 'add or edit text color in the editor' },
    TextDropArea: { id: 'DropArea', value: 'Húzza ide a feltöltendő fájlokat', comment: 'text for drop area for advanced fileupload' },
    TextDropAreaWithBrowse: { id: 'TextDropAreaWithBrowse', value: 'Húzza ide vagy <span class="hyperlink">válassza ki</span> a feltöltendő fájlokat', comment: 'text for drop area with browse for advanced fileupload' },
    TextBtnCancel: { id: 'TextBtnCancel', value: 'Fájl feltöltésének megszakítása', comment: 'text for cancel button for advanced fileupload' },
    TextBtnCloseError: { id: 'TextBtnCloseError', value: 'Hibaüzenet bezárása', comment: 'text for error close button for advanced fileupload' },
    TextBtnRemove: { id: 'TextBtnRemove', value: 'Hibaüzenet bezárása', comment: 'text for remove button for advanced fileupload' },
    Timer: { id: 'Timer', value: 'Időzítő', comment: 'Timer tooltip' },
    To: { id: 'To', value: 'Záró dátum', comment: 'End of a range (of dates)' },
    Today: { id: 'Today', value: 'Ma', comment: 'refering to today on a calendar' },
    ToggleBold: { id: 'ToggleBold', value: 'Félkövéren szedés ki-/bekapcsolása', comment: 'turn on and off bold in text editor (like word)' },
    ToggleH3: { id: 'ToggleH3', value: '3. címsor ki-/bekapcsolása', comment: 'turn on and off heading 3 text' },
    ToggleH4: { id: 'ToggleH4', value: '4. címsor ki-/bekapcsolása', comment: 'turn on and off heading 4 text' },
    ToggleItalic: { id: 'ToggleItalic', value: 'Dőlten szedés ki-/bekapcsolása', comment: 'turn on and off Italic in text editor (like word)' },
    ToggleUnderline: { id: 'ToggleUnderline', value: 'Aláhúzás ki-/bekapcsolása', comment: 'turn on and off Underline in text editor (like word)' },
    Toolbar: { id: 'Toolbar', value: 'Eszköztár', comment: 'describing the toolbar component' },
    TopAlign: { id: 'TopAlign', value: 'Felülre igazítás', comment: 'Top Align tooltip' },
    Total: { id: 'Total', value: 'Összesen', comment: 'Mathematic total of a calculation' },
    Totals: { id: 'Totals', value: 'Összegek', comment: 'Mathematic total of a calculation (plural)' },
    TreeCollapse: { id: 'TreeCollapse', value: 'Fa összecsukása', comment: 'Tree Collapse tooltip' },
    TreeExpand: { id: 'TreeExpand', value: 'Fa kibontása', comment: 'Tree Expand tooltip' },
    Turquoise: { id: 'Turquoise', value: 'Türkiz', comment: 'Color in our color pallette' },
    Up: { id: 'Up', value: 'Fel', comment: 'Up tooltip' },
    UpComingEvents: { id: 'UpComingEvent', value: 'Közelgő események', comment: 'List of upcoming calendar events' },
    UpComingTimeOff: { id: 'UpComingTimeOff', value: 'Közelgő szabadság', comment: 'As in time off work' },
    Upload: { id: 'Upload', value: 'Feltöltés', comment: 'Upload tooltip' },
    UnavailableDate: { id: 'UnavailableDate', value: 'Nem elérhető dátum', comment: 'Unavailable Date Text' },
    Underline: { id: 'Underline', value: 'Aláhúzás', comment: 'Make text Underlined' },
    Undo: { id: 'Undo', value: 'Visszavonás', comment: 'Undo tooltip' },
    Unlocked: { id: 'Unlocked', value: 'Nem zárolt', comment: 'Unlocked tooltip' },
    UnorderedList: { id: 'UnorderedList', value: 'Listajeles felsorolás beszúrása/eltávolítása', comment: 'Insert an Unordered list in the editor' },
    Unsupported: { id: 'Unsupported', value: 'Ez a tartalom nem érhető el, mivel a jelenleg használt böngészőverzió által nem támogatott funkciókat tartalmaz.', comment: 'Suggesting browser upgrade for missing features.' },
    Url: { id: 'Url', value: 'URL', comment: 'Url tooltip' },
    UseArrow: { id: 'UseArrow', value: '. A kijelöléshez használja a nyílbillentyűket.', comment: 'Instructional comments for screen readers' },
    UseEnter: { id: 'UseEnter', value: '. A kereséshez nyomja meg az Enter vagy a lefelé mutató nyílbillentyűt.', comment: 'Instructional comments for screen readers' },
    User: { id: 'User', value: 'Felhasználó', comment: 'User tooltip' },
    UserProfile: { id: 'UserProfile', value: 'Felhasználói profil', comment: 'User Profile tooltip' },
    Version: { id: 'Version', value: 'IDS-verzió', comment: 'Version of IDS' },
    VerticalMiddleAlign: { id: 'VerticalMiddleAlign', value: 'Középre igazítás függőlegesen', comment: 'Vertical Align tooltip' },
    ViewSource: { id: 'ViewSource', value: 'Forrás megtekintése', comment: 'Toggle the source view in the editor' },
    ViewVisual: { id: 'ViewVisual', value: 'Vizuális nézet', comment: 'Toggle the visual view in the editor' },
    Week: { id: 'Week', value: 'Hét', comment: 'Shows a view of the current weeks events' },
    Year: { id: 'Year', value: 'Év', comment: 'As in a date year' },
    Yes: { id: 'Yes', value: 'Igen', comment: 'On a dialog button' }
  }
});
