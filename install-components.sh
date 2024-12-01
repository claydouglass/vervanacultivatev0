#!/bin/bash

# First install the dependencies we know we need
npm install react-day-picker date-fns @radix-ui/react-scroll-area

# Now install each component individually
components=(
  "accordion"
  "alert"
  "alert-dialog"
  "aspect-ratio"
  "avatar"
  "badge"
  "button"
  "calendar"
  "card"
  "checkbox"
  "collapsible"
  "command"
  "context-menu"
  "dialog"
  "dropdown-menu"
  "hover-card"
  "input"
  "label"
  "menubar"
  "navigation-menu"
  "popover"
  "progress"
  "radio-group"
  "scroll-area"
  "select"
  "separator"
  "sheet"
  "skeleton"
  "slider"
  "switch"
  "table"
  "tabs"
  "textarea"
  "toast"
  "toggle"
  "toggle-group"
  "tooltip"
)

for component in "${components[@]}"
do
  echo "Installing $component..."
  npx @shadcn/ui@latest add "$component" --path ./components/ui
done
