import "react";

declare global {
    namespace JSX {
        interface IntrinsicElements {
            /**
             * The AppKit button web component. Registered globally by AppKit.
             */
            "appkit-button": React.DetailedHTMLProps<
                React.HTMLAttributes<HTMLElement>,
                HTMLElement
            >;
        }
    }
}

// Module declarations for packages without types
declare module 'lucide-react';

// Ensures file is treated as a module
export { };

