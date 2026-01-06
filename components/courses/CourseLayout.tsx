"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
} from "@/components/ui/sidebar";
import { StickyTOCSidebar } from "@/components/ui/blog/StickyTOCSidebar";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { CheckmarkCircle02Icon, Home01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import SiteShell from "@/components/layout/SiteShell";
import {
	sidebarContainer,
	sidebarItem,
	viewToggleContent,
} from "@/lib/motion-variants";

// ==========================================
// TYPES
// ==========================================

export interface Lesson {
	slug: string;
	title: string;
	module: string;
	order: number;
	url: string;
	access?: "public" | "paid" | "preview";
	category?: "fundamentals" | "walkthroughs";
	isCompleted?: boolean;
}

interface ModuleGroup {
	name: string;
	index: number;
	lessons: Lesson[];
}

interface TOCItem {
	title: string;
	url: string;
	depth: number;
}

interface CourseLayoutProps {
	courseSlug: string;
	lessons: Lesson[];
	tocItems?: TOCItem[];
	children: React.ReactNode;
	className?: string;
}

// ==========================================
// VIEW TOGGLE OPTIONS
// ==========================================

const VIEW_OPTIONS = [
	{ value: "fundamentals", label: "Fundamentals" },
	{ value: "walkthroughs", label: "Walkthroughs" },
];

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

/**
 * Groups lessons by module and adds module index for numbering
 */
function groupLessonsByModule(lessons: Lesson[]): ModuleGroup[] {
	const groups: Record<string, Lesson[]> = {};

	lessons.forEach((lesson) => {
		const moduleName = lesson.module || "Lessons";
		if (!groups[moduleName]) {
			groups[moduleName] = [];
		}
		groups[moduleName].push(lesson);
	});

	// Sort lessons within each group by order
	Object.values(groups).forEach((group) => {
		group.sort((a, b) => a.order - b.order);
	});

	// Convert to array with index for "Module 01" numbering
	return Object.entries(groups).map(([name, lessons], index) => ({
		name,
		index: index + 1,
		lessons,
	}));
}

// ==========================================
// COURSE SIDEBAR COMPONENT
// ==========================================

function CourseSidebar({
	courseSlug,
	lessons,
}: {
	courseSlug: string;
	lessons: Lesson[];
}) {
	const pathname = usePathname();
	const prefersReducedMotion = useReducedMotion();
	const [activeView, setActiveView] = useState<string>("fundamentals");

	// Check if any lessons have categories (to show/hide toggle)
	const hasCategories = lessons.some((lesson) => lesson.category);

	// Filter lessons by category if categories are defined
	const filteredLessons = hasCategories
		? lessons.filter((lesson) => {
				if (!lesson.category) return true;
				return lesson.category === activeView;
			})
		: lessons;

	const modules = groupLessonsByModule(filteredLessons);

	return (
		<Sidebar collapsible="icon">
			<SidebarHeader className="border-b border-border">
				{/* View Toggle (if categories exist) */}
				{hasCategories && (
					<div className="p-3 pb-0">
						<SegmentedControl
							options={VIEW_OPTIONS}
							value={activeView}
							onChange={setActiveView}
							size="sm"
						/>
					</div>
				)}

				{/* Course Overview Link */}
				<SidebarMenu className="p-3">
					<SidebarMenuItem>
						<SidebarMenuButton asChild tooltip="Course Overview">
							<Link href={`/courses/${courseSlug}`} className="cursor-pointer">
								<HugeiconsIcon icon={Home01Icon} size={16} />
								<span>Course Overview</span>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>

			<SidebarContent>
				<AnimatePresence mode="wait">
					<motion.div
						key={activeView}
						initial={prefersReducedMotion ? false : "hidden"}
						animate="visible"
						exit="hidden"
						variants={viewToggleContent}
					>
						{modules.map((module, moduleIndex) => (
							<SidebarGroup key={module.name}>
								{/* Enhanced Module Header - Two line format */}
								<div className="px-3 py-2">
									<span className="text-xs text-muted-foreground tracking-wide">
										Module {String(module.index).padStart(2, "0")}
									</span>
									<h3 className="text-sm font-medium text-foreground mt-0.5 leading-tight">
										{module.name}
									</h3>
								</div>

								<SidebarGroupContent>
									<motion.div
										variants={sidebarContainer}
										initial={prefersReducedMotion ? false : "hidden"}
										animate="visible"
									>
										<SidebarMenu>
											{module.lessons.map((lesson) => {
												const isActive = pathname === lesson.url;

												return (
													<motion.div
														key={lesson.slug}
														variants={sidebarItem}
													>
														<SidebarMenuItem>
															<SidebarMenuButton
																asChild
																isActive={isActive}
																tooltip={lesson.title}
															>
																<Link
																	href={lesson.url}
																	className="cursor-pointer flex items-center justify-between gap-2"
																>
																	<span className="truncate flex-1">
																		{lesson.title}
																	</span>
																	{/* Checkmark on RIGHT for completed */}
																	{lesson.isCompleted && (
																		<HugeiconsIcon
																			icon={CheckmarkCircle02Icon}
																			size={14}
																			className="text-primary shrink-0"
																		/>
																	)}
																</Link>
															</SidebarMenuButton>
														</SidebarMenuItem>
													</motion.div>
												);
											})}
										</SidebarMenu>
									</motion.div>
								</SidebarGroupContent>
							</SidebarGroup>
						))}
					</motion.div>
				</AnimatePresence>
			</SidebarContent>

			<SidebarRail />
		</Sidebar>
	);
}

// ==========================================
// COURSE LAYOUT COMPONENT
// ==========================================

export function CourseLayout({
	courseSlug,
	lessons,
	tocItems,
	children,
	className,
}: CourseLayoutProps) {
	const toc =
		tocItems && tocItems.length > 0 ? (
			<StickyTOCSidebar items={tocItems} />
		) : null;

	return (
		<SiteShell
			sidebar={<CourseSidebar courseSlug={courseSlug} lessons={lessons} />}
			toc={toc}
			className={cn("relative", className)}
		>
			<div className="min-w-0">{children}</div>
		</SiteShell>
	);
}

export default CourseLayout;
