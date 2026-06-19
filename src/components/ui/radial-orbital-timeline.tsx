"use client";

import {
  useState,
  useEffect,
  useRef,
  type CSSProperties,
  type ElementType,
  type MouseEvent,
  type ReactNode,
} from "react";
import { ArrowRight, Link2, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface TimelineItem {
  id: number;
  title: string;
  date: string;
  content: string;
  category: string;
  icon: ElementType<{ size?: number; className?: string }>;
  relatedIds: number[];
  status: "completed" | "in-progress" | "pending";
  energy: number;
}

export interface RadialOrbitalTimelineProps {
  timelineData: TimelineItem[];
  /** Renders a compact orbit for use inside a section card instead of full-screen */
  embed?: boolean;
  className?: string;
  /** Disables auto-rotation when the user prefers reduced motion */
  prefersReducedMotion?: boolean;
  /** Custom element rendered at the orbit center (embed only). Falls back to the gradient donut. */
  centerSlot?: ReactNode;
}

export default function RadialOrbitalTimeline({
  timelineData,
  embed = false,
  className,
  prefersReducedMotion = false,
  centerSlot,
}: RadialOrbitalTimelineProps) {
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>({});
  const [viewMode] = useState<"orbital">("orbital");
  // Initial frame seats the first node (Magnesium) at the bottom in embed mode
  // (canonical pentagon layout); the orbit then rotates slowly from there.
  const initialAngle = embed ? 90 : 0;
  const [rotationAngle, setRotationAngle] = useState<number>(initialAngle);
  const [autoRotate, setAutoRotate] = useState<boolean>(() => !prefersReducedMotion);
  // Defer rotation-driven positions until after mount so SSR and the first
  // client render agree (prevents a hydration mismatch from the animated angle).
  const [hasMounted, setHasMounted] = useState(false);
  const [pulseEffect, setPulseEffect] = useState<Record<number, boolean>>({});
  const [centerOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [activeNodeId, setActiveNodeId] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const orbitRadius = embed ? 118 : 200;

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) setAutoRotate(false);
  }, [prefersReducedMotion]);

  const handleContainerClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === containerRef.current || e.target === orbitRef.current) {
      setExpandedItems({});
      setActiveNodeId(null);
      setPulseEffect({});
      setAutoRotate(!prefersReducedMotion);
    }
  };

  const toggleItem = (id: number) => {
    setExpandedItems((prev) => {
      const newState = { ...prev };
      Object.keys(newState).forEach((key) => {
        if (parseInt(key, 10) !== id) {
          newState[parseInt(key, 10)] = false;
        }
      });

      newState[id] = !prev[id];

      if (!prev[id]) {
        setActiveNodeId(id);
        setAutoRotate(false);

        const relatedItems = getRelatedItems(id);
        const newPulseEffect: Record<number, boolean> = {};
        relatedItems.forEach((relId) => {
          newPulseEffect[relId] = true;
        });
        setPulseEffect(newPulseEffect);

        centerViewOnNode(id);
      } else {
        setActiveNodeId(null);
        setAutoRotate(!prefersReducedMotion);
        setPulseEffect({});
      }

      return newState;
    });
  };

  useEffect(() => {
    let rotationTimer: ReturnType<typeof setInterval>;

    if (autoRotate && viewMode === "orbital") {
      rotationTimer = setInterval(() => {
        setRotationAngle((prev) => {
          const newAngle = (prev + 0.3) % 360;
          return Number(newAngle.toFixed(3));
        });
      }, 50);
    }

    return () => {
      clearInterval(rotationTimer);
    };
  }, [autoRotate, viewMode]);

  const centerViewOnNode = (nodeId: number) => {
    // Keep the embed diagram static — tapping expands the card without spinning.
    if (embed) return;
    if (viewMode !== "orbital" || !nodeRefs.current[nodeId]) return;

    const nodeIndex = timelineData.findIndex((item) => item.id === nodeId);
    const totalNodes = timelineData.length;
    const targetAngle = (nodeIndex / totalNodes) * 360;

    setRotationAngle(270 - targetAngle);
  };

  const calculateNodePosition = (index: number, total: number) => {
    const angle = ((index / total) * 360 + (hasMounted ? rotationAngle : initialAngle)) % 360;
    const radius = orbitRadius;
    const radian = (angle * Math.PI) / 180;

    const x = radius * Math.cos(radian) + centerOffset.x;
    const y = radius * Math.sin(radian) + centerOffset.y;

    // Embed mode keeps every node fully opaque and flat; the full-screen mode
    // uses depth-based fading.
    const zIndex = embed ? 100 : Math.round(100 + 50 * Math.cos(radian));
    const opacity = embed
      ? 1
      : Math.max(0.4, Math.min(1, 0.4 + 0.6 * ((1 + Math.sin(radian)) / 2)));

    return { x, y, angle, zIndex, opacity };
  };

  const getRelatedItems = (itemId: number): number[] => {
    const currentItem = timelineData.find((item) => item.id === itemId);
    return currentItem ? currentItem.relatedIds : [];
  };

  const isRelatedToActive = (itemId: number): boolean => {
    if (!activeNodeId) return false;
    const relatedItems = getRelatedItems(activeNodeId);
    return relatedItems.includes(itemId);
  };

  const getStatusStyles = (status: TimelineItem["status"]): string => {
    switch (status) {
      case "completed":
        return "text-white bg-black border-white";
      case "in-progress":
        return "text-black bg-white border-black";
      case "pending":
        return "text-white bg-black/40 border-white/50";
      default:
        return "text-white bg-black/40 border-white/50";
    }
  };

  const getStatusStylesEmbed = (status: TimelineItem["status"]): string => {
    switch (status) {
      case "completed":
        return "border-primary/40 bg-primary/15 text-primary";
      case "in-progress":
        return "border-secondary/40 bg-secondary/15 text-secondary";
      case "pending":
        return "border-neutral-dark/30 bg-neutral-light text-neutral-dark";
      default:
        return "border-neutral-dark/30 bg-neutral-light text-neutral-dark";
    }
  };

  return (
    <div
      className={cn(
        "flex w-full flex-col items-center justify-center",
        embed ? "overflow-visible" : "overflow-hidden",
        embed
          ? "min-h-[360px] rounded-xl bg-transparent md:min-h-[400px]"
          : "h-screen bg-black",
        className,
      )}
      ref={containerRef}
      onClick={handleContainerClick}
    >
      <div
        className={cn(
          "relative flex h-full w-full max-w-4xl items-center justify-center",
          embed ? "py-4" : "",
        )}
      >
        <div
          className="absolute flex h-full w-full items-center justify-center"
          ref={orbitRef}
          style={{
            perspective: "1000px",
            transform: `translate(${centerOffset.x}px, ${centerOffset.y}px)`,
          }}
        >
          {embed && centerSlot ? (
            <div className="absolute z-10 flex items-center justify-center">{centerSlot}</div>
          ) : (
            <div
              className={cn(
                "absolute z-10 flex items-center justify-center rounded-full",
                embed
                  ? "h-12 w-12 bg-gradient-to-br from-[#8CAB77] via-[#6995B1] to-[#A8762E] shadow-[0_8px_22px_-8px_rgba(105,149,177,0.6)]"
                  : "h-16 w-16 animate-pulse bg-gradient-to-br from-primary via-secondary to-primary",
              )}
            >
              {!embed && (
                <>
                  <div className="absolute h-20 w-20 rounded-full border border-white/20 opacity-70 animate-ping" />
                  <div
                    className="absolute h-24 w-24 rounded-full border border-white/10 opacity-50 animate-ping"
                    style={{ animationDelay: "0.5s" }}
                  />
                </>
              )}
              <div
                className={cn(
                  "rounded-full",
                  embed ? "h-[26px] w-[26px] bg-white" : "h-8 w-8 bg-white/80 backdrop-blur-md",
                )}
              />
            </div>
          )}

          {embed ? (
            <>
              <div className="absolute h-[236px] w-[236px] rounded-full border border-neutral-darkest/[0.08]" />
              <div className="absolute h-[132px] w-[132px] rounded-full border border-neutral-darkest/[0.08]" />
            </>
          ) : (
            <div className="absolute h-96 w-96 rounded-full border border-white/10" />
          )}

          {timelineData.map((item, index) => {
            const position = calculateNodePosition(index, timelineData.length);
            const isExpanded = expandedItems[item.id];
            const isRelated = isRelatedToActive(item.id);
            const isPulsing = pulseEffect[item.id];
            const Icon = item.icon;

            const nodeStyle: CSSProperties = {
              transform: `translate(${position.x}px, ${position.y}px)`,
              zIndex: isExpanded ? 200 : position.zIndex,
              opacity: isExpanded ? 1 : position.opacity,
            };

            return (
              <div
                key={item.id}
                ref={(el) => {
                  nodeRefs.current[item.id] = el;
                }}
                className="absolute cursor-pointer transition-all duration-700"
                style={nodeStyle}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleItem(item.id);
                }}
              >
                <div
                  className={cn("absolute -inset-1 rounded-full", isPulsing ? "animate-pulse duration-1000" : "")}
                  style={{
                    background: embed
                      ? `radial-gradient(circle, rgba(140,171,119,0.22) 0%, rgba(140,171,119,0) 70%)`
                      : `radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%)`,
                    width: `${item.energy * 0.5 + 40}px`,
                    height: `${item.energy * 0.5 + 40}px`,
                    left: `-${(item.energy * 0.5 + 40 - 40) / 2}px`,
                    top: `-${(item.energy * 0.5 + 40 - 40) / 2}px`,
                  }}
                />

                <div
                  className={cn(
                    "flex h-10 w-10 transform items-center justify-center rounded-full border-2 transition-all duration-300",
                    embed
                      ? isExpanded
                        ? "scale-150 border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                        : isRelated
                          ? "animate-pulse border-primary/50 bg-primary/15 text-primary"
                          : "border-neutral-light bg-white text-primary shadow-[0_6px_16px_-6px_rgba(47,58,51,0.28)]"
                      : isExpanded
                        ? "scale-150 border-white bg-white text-black shadow-lg shadow-white/30"
                        : isRelated
                          ? "animate-pulse border-white bg-white/50 text-black"
                          : "border-white/40 bg-black text-white",
                  )}
                >
                  <Icon size={embed ? 14 : 16} />
                </div>

                <div
                  className={cn(
                    "absolute top-12 whitespace-nowrap text-xs font-semibold tracking-wider transition-all duration-300",
                    embed
                      ? isExpanded
                        ? "scale-125 text-neutral-darkest"
                        : "text-neutral-dark"
                      : isExpanded
                        ? "scale-125 text-white"
                        : "text-white/70",
                  )}
                >
                  {item.title}
                </div>

                {isExpanded && (
                  <Card
                    className={cn(
                      "absolute left-1/2 top-20 w-64 max-w-[min(16rem,calc(100vw-3rem))] -translate-x-1/2 overflow-visible shadow-xl backdrop-blur-lg",
                      embed
                        ? "border border-neutral-light bg-white/95 text-neutral-darkest shadow-neutral-darkest/10"
                        : "border-white/30 bg-black/90 text-white shadow-white/10",
                    )}
                  >
                    <div
                      className={cn(
                        "absolute left-1/2 top-[-12px] h-3 w-px -translate-x-1/2",
                        embed ? "bg-primary/40" : "bg-white/50",
                      )}
                    />
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <Badge
                          className={cn(
                            "px-2 text-xs",
                            embed ? getStatusStylesEmbed(item.status) : getStatusStyles(item.status),
                          )}
                        >
                          {item.status === "completed"
                            ? "COMPLETE"
                            : item.status === "in-progress"
                              ? "IN PROGRESS"
                              : "PENDING"}
                        </Badge>
                        <span
                          className={cn(
                            "font-mono text-xs",
                            embed ? "text-neutral-dark" : "text-white/50",
                          )}
                        >
                          {item.date}
                        </span>
                      </div>
                      <CardTitle
                        className={cn("mt-2 text-sm", embed ? "text-neutral-darkest" : "text-white")}
                      >
                        {item.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className={cn("text-xs", embed ? "text-neutral-dark" : "text-white/80")}>
                      <p>{item.content}</p>

                      <div
                        className={cn("mt-4 border-t pt-3", embed ? "border-neutral-light" : "border-white/10")}
                      >
                        <div className="mb-1 flex items-center justify-between text-xs">
                          <span className="flex items-center">
                            <Zap size={10} className={cn("mr-1", embed && "text-primary")} />
                            Energy Level
                          </span>
                          <span className="font-mono">{item.energy}%</span>
                        </div>
                        <div
                          className={cn(
                            "h-1 w-full overflow-hidden rounded-full",
                            embed ? "bg-neutral-light" : "bg-white/10",
                          )}
                        >
                          <div
                            className="h-full bg-gradient-to-r from-secondary to-primary"
                            style={{ width: `${item.energy}%` }}
                          />
                        </div>
                      </div>

                      {item.relatedIds.length > 0 && (
                        <div
                          className={cn("mt-4 border-t pt-3", embed ? "border-neutral-light" : "border-white/10")}
                        >
                          <div className="mb-2 flex items-center">
                            <Link2
                              size={10}
                              className={cn("mr-1", embed ? "text-neutral-dark" : "text-white/70")}
                            />
                            <h4
                              className={cn(
                                "text-xs font-medium uppercase tracking-wider",
                                embed ? "text-neutral-dark" : "text-white/70",
                              )}
                            >
                              Connected nodes
                            </h4>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {item.relatedIds.map((relatedId) => {
                              const relatedItem = timelineData.find((i) => i.id === relatedId);
                              return (
                                <Button
                                  key={relatedId}
                                  variant="outline"
                                  size="sm"
                                  className={cn(
                                    "flex h-6 items-center rounded-md px-2 py-0 text-xs transition-all",
                                    embed
                                      ? "border-neutral-light bg-background-main text-neutral-darkest hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
                                      : "rounded-none border-white/20 bg-transparent text-white/80 hover:bg-white/10 hover:text-white",
                                  )}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleItem(relatedId);
                                  }}
                                >
                                  {relatedItem?.title}
                                  <ArrowRight
                                    size={8}
                                    className={cn("ml-1", embed ? "text-neutral-dark/60" : "text-white/60")}
                                  />
                                </Button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
