export const TaskPageClasses = {
  container: "container mx-auto min-h-screen p-6",
  heading: "font-bold text-3xl",
  sectionHeading: "font-semibold text-2xl",
  searchInputWrapper: "relative w-full sm:max-w-[460px] md:max-w-[350px]",
  searchInputIcon:
    "pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400",
  searchInput: "w-full pl-10",
  buttonPrimary: "w-full whitespace-nowrap sm:w-auto",
  select: "w-full sm:w-[225px]",
  switchLabel: "text-sm",
  switchWrapper: "flex items-center gap-2",
  flexGap2: "flex w-full flex-col gap-2 sm:flex-row sm:items-start sm:gap-2",
  flexGap4: "flex w-full flex-col gap-4",
  flexWrapGap3: "flex w-full flex-wrap gap-3",
  gridContainer: "mb-10 grid w-full grid-cols-1 gap-6 md:grid-cols-[300px_1fr_auto]",
};

export const TaskKanbanCardClasses = {
  card: "relative cursor-move border-border/50 p-3 w-full",
  cardHover: "hover:brightness-105",
  dragHandle: "cursor-grab active:cursor-grabbing",
  header: "p-0 pb-2",
  title: "truncate text-sm",
  content: "space-y-1 p-0",
  badgeRow: "flex flex-wrap items-center gap-2",
  urlText: "truncate text-muted-foreground text-xs",
  progressWrapper: "mt-1 flex flex-wrap items-center gap-1",
  progressLabel: "text-muted-foreground text-xs",
  progressDots: "flex flex-wrap gap-0.5",
  progressDotBase: "h-1.5 w-1.5 rounded-full",
  progressDotLow: "bg-blue-500",
  progressDotMid: "bg-yellow-500",
  progressDotHigh: "bg-red-500",
  progressOverflow: "ml-1 font-semibold text-red-600 text-xs",
  avatarWrapper: "absolute right-3 bottom-3 sm:right-2 sm:bottom-2",
  avatar: "size-6 border border-border",
  avatarFallback: "bg-purple-100 font-medium text-purple-700 text-xs",
  viewButton:
    "mt-2 w-full rounded border border-transparent py-1.5 text-left text-muted-foreground text-xs underline transition-colors hover:border-border hover:bg-muted/50 hover:text-foreground",
};

export const TaskKanbanColumnClasses = {
  columnBase: "min-h-[200px] space-y-2 rounded-lg border border-dashed p-2 transition-colors",
  columnActive: "border-primary bg-primary/5",
  columnIdle: "border-gray-200/50 bg-gray-50/30 hover:border-gray-300/50 dark:bg-gray-900/30",
  header: "sticky top-0 z-10 flex items-center justify-between bg-background py-1",
  title: "font-medium text-muted-foreground text-sm",
  menuButton: "h-6 w-6 p-0",
  list: "space-y-2",
};

export const TaskKanbanDragClasses = {
  gridBase: "grid gap-4",
  gridWithBacklog: "grid-cols-1 sm:grid-cols-2 md:grid-cols-4",
  gridNoBacklog: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3",
  overlayCard:
    "relative w-full rotate-3 border-border/50 bg-background p-3 opacity-90 shadow-lg backdrop-blur-sm sm:w-64",
  overlayHeader: "p-0 pb-2",
  overlayTitle: "text-sm",
  overlayContent: "space-y-1 p-0",
  overlayBadgeRow: "flex items-center gap-2",
  overlayAvatarWrapper: "absolute right-3 bottom-3",
  overlayAvatar: "size-6 border border-border",
  overlayAvatarFallback: "bg-purple-100 font-medium text-purple-700 text-xs",
};

export const TaskDialogClasses = {
  dialogContent:
    "max-h-[90vh] w-full max-w-[85vw] max-w-[95vw] overflow-y-auto rounded-lg bg-background p-5 shadow-lg transition-all sm:max-w-xl sm:p-6 dark:bg-gray-900",

  header: "space-y-1",
  title: "font-semibold text-lg sm:text-xl",
  description: "text-muted-foreground text-sm sm:text-base",

  form: "space-y-4",

  grid2Cols: "grid grid-cols-2 gap-4",

  footer: "flex flex-col gap-2 sm:flex-row sm:justify-end",

  buttonCancel: "w-full sm:w-auto",
  buttonSubmit: "w-full sm:w-auto",
};
