import { GridPattern } from "@repo/ui/components/grid-pattern";
import { cn } from "@/lib/utils";
import type React from "react";
import { FeatureType, FEATURES } from "./data/feature-data";

export default function FeatureSection() {
	return (
		<div className="mx-auto w-full max-w-5xl space-y-8 p-4">
			<div className="mx-auto max-w-3xl text-center space-y-2">
				<div className="flex justify-center">
                    <div className="rounded-lg border px-4 py-1">Features</div>
                </div>
				<h2 className="px-4 text-center font-bold text-2xl tracking-tight md:text-3xl lg:font-extrabold lg:text-4xl">
					Empowering Knowledge in the Digital Age.
				</h2>
				<p className="mt-4 text-balance text-muted-foreground text-sm md:text-base">
					The all-in-one platform to manage, secure, and scale your digital library infrastructure.
				</p>
			</div>

			<div className="overflow-hidden rounded-lg border">
				<div className="grid grid-cols-1 gap-px bg-border sm:grid-cols-2 md:grid-cols-3">
					{FEATURES.map((feature) => (
						<FeatureCard feature={feature} key={feature.title} />
					))}
				</div>
			</div>
		</div>
	);
}

export function FeatureCard({
	feature,
	className,
	...props
}: React.ComponentProps<"div"> & {
	feature: FeatureType;
}) {
	return (
		<div
			className={cn("relative overflow-hidden bg-background p-6", className)}
			{...props}
		>
			<div className="-mt-2 -ml-20 mask-[radial-gradient(farthest-side_at_top,white,transparent)] pointer-events-none absolute top-0 left-1/2 size-full">
				<GridPattern
					className="absolute inset-0 size-full stroke-foreground/20"
					height={40}
					width={40}
					x={5}
				/>
			</div>
			<feature.icon
				aria-hidden
				className="size-6 text-foreground/75"
				strokeWidth={1}
			/>
			<h3 className="mt-10 text-sm md:text-base">{feature.title}</h3>
			<p className="relative z-20 mt-2 font-light text-muted-foreground text-xs">
				{feature.description}
			</p>
		</div>
	);
}
