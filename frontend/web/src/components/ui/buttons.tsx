import { type ComponentProps } from "react";
import { tv, type VariantProps } from "tailwind-variants";

const buttonVariants = tv({
    base: "text-zinc-400 rounded-lg hover:text-zinc-100 hover:bg-zinc-800 disabled:opacity-50 disabled:pointer-events-none transition-colors flex-shrink-0",

    variants: {
        size: {
            default: "px-3 sm:px-3 py-2 text-sm sm:text-sm",
            icon: "p-2 sm:p-2",
            "icon-sm": "p-1 sm:p-1",
        },
    },


    defaultVariants: {
        size: "default",
    },

});

export function Button({
    size,
    className,
    ...props
}: ComponentProps<"button"> & VariantProps<typeof buttonVariants>) {
    return <button className={buttonVariants({ size, className })} {...props} />;
}
