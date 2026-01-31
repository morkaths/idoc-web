"use client";
import React from "react";
import { motion } from "motion/react";
import { cn } from "@repo/ui/lib/utils";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@repo/ui/components/tooltip";
import { Button } from "@repo/ui/components/button";
import { CheckCircleIcon, StarIcon } from "lucide-react";
import Link from "next/link";
import { Plan, PLANS } from "./data/plan-data";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@repo/ui/components/carousel";

export type FREQUENCY = "monthly" | "yearly";

// Toggle frequency between monthly and yearly
type FrequencyToggleProps = React.ComponentProps<"div"> & {
    frequency: FREQUENCY;
    setFrequency: React.Dispatch<React.SetStateAction<FREQUENCY>>;
    frequencies?: FREQUENCY[];
};
export function FrequencyToggle({
    frequency,
    setFrequency,
    frequencies = ["monthly", "yearly"],
    ...props
}: FrequencyToggleProps) {
    return (
        <div
            className={cn(
                "mx-auto flex w-fit rounded-full border bg-background p-1 shadow-xs",
                props.className
            )}
            {...props}
        >
            {frequencies.map((freq) => (
                <button
                    className="relative px-4 py-1 text-sm capitalize"
                    key={freq}
                    onClick={() => setFrequency(freq)}
                    type="button"
                >
                    <span className="relative z-10">{freq}</span>
                    {frequency === freq && (
                        <motion.span
                            className="absolute inset-0 z-10 rounded-full mix-blend-difference bg-background dark:bg-foreground"
                            layoutId="frequency"
                            transition={{ type: "spring", duration: 0.4 }}
                        />
                    )}
                </button>
            ))}
        </div>
    );
}

// Pricing plan interface
interface PricingSectionProps extends React.ComponentProps<"div"> {
}
export function PricingSection({ ...props }: PricingSectionProps) {
    const [frequency, setFrequency] = React.useState<"monthly" | "yearly">("monthly");
    return (
        <div
            className={cn(
                "flex w-full flex-col items-center justify-center space-y-7 p-4",
                props.className
            )}
            {...props}
        >
            <div className="mx-auto max-w-xl space-y-2">
                <div className="flex justify-center">
                    <div className="rounded-lg border px-4 py-1">Pricing</div>
                </div>
                <h2 className="text-center font-bold text-2xl tracking-tight md:text-3xl lg:font-extrabold lg:text-4xl">
                    Plans that Scale with You
                </h2>
                <p className="text-center text-muted-foreground text-sm md:text-base">
                    Whether you're just starting out or growing fast, our flexible pricing has you covered — with no hidden costs.
                </p>
            </div>

            <FrequencyToggle frequency={frequency} setFrequency={setFrequency} />
            <div className="hidden md:grid mx-auto w-full max-w-6xl grid-cols-3 gap-6">
                {PLANS.map((plan) => (
                    <PricingCard frequency={frequency} key={plan.name} plan={plan} />
                ))}
            </div>

            <div className="block md:hidden w-full max-w-xs sm:max-w-sm px-4">
                <Carousel 
                    opts={{ align: "start", loop: true }} 
                    className="w-full"
                >
                    <CarouselContent className="-ml-4">
                        {PLANS.map((plan) => (
                            <CarouselItem key={plan.name} className="pl-4">
                                <div className="py-4 px-2"> 
                                    <PricingCard frequency={frequency} plan={plan} />
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <div className="flex justify-center gap-2 mt-4">
                        <CarouselPrevious className="static translate-y-0" />
                        <CarouselNext className="static translate-y-0" />
                    </div>
                </Carousel>
            </div>
        </div>
    );
}

// Pricing card interface
type PricingCardProps = React.ComponentProps<"div"> & {
    plan: Plan;
    frequency?: FREQUENCY;
};
export function PricingCard({
    plan,
    className,
    frequency = "monthly",
    ...props
}: PricingCardProps) {
    return (
        <div
            className={cn(
                "relative flex w-full flex-col rounded-lg border shadow-sm",
                plan.highlighted && "scale-105",
                className
            )}
            key={plan.name}
            {...props}
        >
            <div
                className={cn(
                    "rounded-t-lg border-b p-4",
                    plan.highlighted && "bg-card dark:bg-card/80"
                )}
            >
                <div className="absolute top-2 right-2 z-10 flex items-center gap-2">
                    {plan.highlighted && (
                        <p className="flex items-center gap-1 rounded-md border bg-background px-2 py-0.5 text-xs">
                            <StarIcon className="h-3 w-3 fill-current" />
                            Popular
                        </p>
                    )}
                    {frequency === "yearly" && (
                        <p className="flex items-center gap-1 rounded-md border bg-primary px-2 py-0.5 text-primary-foreground text-xs">
                            {Math.round(
                                ((plan.price.monthly * 12 - plan.price.yearly) /
                                    plan.price.monthly /
                                    12) *
                                100
                            )}
                            % off
                        </p>
                    )}
                </div>

                <div className="font-medium text-lg">{plan.name}</div>
                <p className="font-normal text-muted-foreground text-sm">{plan.info}</p>
                <h3 className="mt-6 mb-2 flex items-end gap-1">
                    <span className="font-extrabold text-3xl">
                        ${plan.price[frequency]}
                    </span>
                    <span className="text-muted-foreground">
                        {plan.name !== "Free"
                            ? `/${frequency === "monthly" ? "month" : "year"}`
                            : ""}
                    </span>
                </h3>
            </div>
            <div
                className={cn(
                    "space-y-4 px-4 pt-6 pb-8 text-muted-foreground text-sm",
                    plan.highlighted && "bg-muted/10"
                )}
            >
                {plan.features.map((feature, index) => (
                    <div className="flex items-center gap-2" key={index}>
                        <CheckCircleIcon className="h-4 w-4 text-foreground" />
                        <TooltipProvider>
                            <Tooltip delayDuration={0}>
                                <TooltipTrigger asChild>
                                    <p
                                        className={cn(feature.tooltip && "cursor-pointer border-b")}
                                    >
                                        {feature.text}
                                    </p>
                                </TooltipTrigger>
                                {feature.tooltip && (
                                    <TooltipContent>
                                        <p>{feature.tooltip}</p>
                                    </TooltipContent>
                                )}
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                ))}
            </div>
            <div
                className={cn(
                    "mt-auto w-full rounded-b-lg border-t p-3",
                    plan.highlighted && "bg-card dark:bg-card/80"
                )}
            >
                <Button
                    asChild
                    className="w-full"
                    variant={plan.highlighted ? "default" : "outline"}
                >
                    <Link href={plan.btn.href}>{plan.btn.text}</Link>
                </Button>
            </div>
        </div>
    );
}
