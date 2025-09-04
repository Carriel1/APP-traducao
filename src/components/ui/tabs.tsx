import  as React from react
import  as TabsPrimitive from @radix-uireact-tabs

import { cn } from @libutils

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef
  React.ElementReftypeof TabsPrimitive.List,
  React.ComponentPropsWithoutReftypeof TabsPrimitive.List
(({ className, ...props }, ref) = (
  TabsPrimitive.List
    ref={ref}
    className={cn(
      inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground,
      className
    )}
    {...props}
  
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef
  React.ElementReftypeof TabsPrimitive.Trigger,
  React.ComponentPropsWithoutReftypeof TabsPrimitive.Trigger
(({ className, ...props }, ref) = (
  TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visibleoutline-none focus-visiblering-2 focus-visiblering-ring focus-visiblering-offset-2 disabledpointer-events-none disabledopacity-50 data-[state=active]bg-background data-[state=active]text-foreground data-[state=active]shadow-sm,
      className
    )}
    {...props}
  
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef
  React.ElementReftypeof TabsPrimitive.Content,
  React.ComponentPropsWithoutReftypeof TabsPrimitive.Content
(({ className, ...props }, ref) = (
  TabsPrimitive.Content
    ref={ref}
    className={cn(
      mt-2 ring-offset-background focus-visibleoutline-none focus-visiblering-2 focus-visiblering-ring focus-visiblering-offset-2,
      className
    )}
    {...props}
  
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
