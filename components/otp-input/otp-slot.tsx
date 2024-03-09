import { cn } from "@/lib/utils";
import { SlotProps } from "input-otp";
import OtpCaret from "./otp-caret";

const OtpSlot = (props: SlotProps)=>{
  return (
    <div
      className={cn(
        'relative w-10 h-14 text-2xl lg:text-3xl',
        'flex items-center justify-center',
        'transition-all duration-300',
        'border-2  border-y border-r first:border-xl first:rounded-l-xl last:rounded-r-xl',
        'group-hover:border-accent-foreground/20 group-focus-within:border-accent-foreground/20',
        'outline outline-0 outline-accent-foreground/20',
        { 'outline-1 outline-primary': props.isActive },
      )}
    >
      {props.char !== null && <div>{props.char}</div>}
      {props.hasFakeCaret && <OtpCaret/>}
    </div>
  )
}

export default OtpSlot;
