# FormLayout Component Documentation

## Overview
`FormLayout` is a shared component that provides a consistent layout wrapper for form screens (both create and edit flows). It handles the page header with title and action buttons, plus optional footer action buttons.

## Props

### Required
- `title` (string): The page title displayed in the header
- `children` (React.ReactNode): The form content to render

### Optional
- `backButton` (object): Renders a button in the header (legacy usage pattern)
  - `label` (string): Button label text
  - `onClick` (function): Click handler
  - `className` (string): Optional custom styling

- `primaryAction` (object): Primary action button (typically "Save")
  - `label` (React.ReactNode): Button label (can be JSX for dynamic content)
  - `onClick` (function): Click handler
  - `disabled` (boolean): Whether button is disabled
  - `className` (string): Custom styling
  - `type` (string): Button type (default: "button")

- `secondaryAction` (object): Secondary action button (typically "Back")
  - `label` (string): Button label
  - `onClick` (function): Click handler
  - `disabled` (boolean): Whether button is disabled
  - `className` (string): Custom styling
  - `type` (string): Button type (default: "button")

- `formWrapperClassName` (string): Custom wrapper class for form content (default: "w-full mx-auto px-2")

## Behavior

### When primaryAction/secondaryAction are provided:
- Action buttons render in both header and footer
- Buttons are centered and spaced with `gap-2`
- Footer section includes a top border separator

### When only backButton is provided:
- Single button renders in header (legacy pattern, used for creation flows)
- Maintains backwards compatibility

## Usage Examples

### Creation Flow (Legacy)
```jsx
<FormLayout
  title="New Pet"
  backButton={{
    label: "Back to Pets",
    onClick: handleBack
  }}
>
  <PetNewForm />
</FormLayout>
```

### Edit Flow (New Pattern)
```jsx
<FormLayout
  title="Edit Pet"
  primaryAction={{
    label: isSaving ? "Saving..." : "Save",
    onClick: handleSave,
    disabled: isSaving
  }}
  secondaryAction={{
    label: "Back to Pets",
    onClick: handleBack
  }}
>
  <form className="space-y-6">
    {/* form fields */}
  </form>
</FormLayout>
```

## Current Usage
- `DashboardPets.jsx`: Creation flow with `backButton` and legacy `FormLayout` behavior
- `DashboardReports.jsx`: Creation flow with `backButton` and legacy `FormLayout` behavior
- `PetEditForm.jsx`: Edit flow with `primaryAction` and `secondaryAction`
- `ReportEditForm.jsx`: Edit flow with `primaryAction` and `secondaryAction`

