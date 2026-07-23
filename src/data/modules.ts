import { routes } from "@/routes/paths";
import type { DetectionModule, DetectionModuleId } from "@/types/module";

const allDetectionModules: DetectionModule[] = [
  {
    id: "human",
    name: "Human Detection",
    route: routes.humanDetection,
    title: "Human Detection with AI-Powered Face Recognition",
    summary: "Identity-aware recognition for visitors, employees, and unusual human activity.",
    description:
      "Authenticate people in real time, detect unknown visitors, and route sensitive recognition events through admin approval.",
    capabilities: ["Face recognition", "Gesture analysis", "Unknown visitor detection"],
    features: ["Face matching confidence", "Visitor watchlists", "Admin approval queue"],
    workflow: ["Face Detection", "Recognition", "Interaction", "Admin Approval"],
    price: "₹999/month",
    pricingNote: "Includes identity events, approval workflow, and dashboard history.",
    metric: { label: "Recognition confidence", value: "98.7%" },
    accent: "cyan",
  },
  {
    id: "object",
    name: "Object Detection",
    route: routes.objectDetection,
    title: "Understand Your Surroundings with AI",
    summary: "Classifies operational assets, electronics, unattended items, and animals.",
    description:
      "Continuously understand your environment with asset classification, real-time object streams, and historical object intelligence.",
    capabilities: ["Asset classification", "Asset owner identification", "Unattended object alerts"],
    features: ["Live Webcam Detection", "Asset Registration", "Owner-Aware Overlays", "Unknown Asset Review"],
    workflow: ["Scene Capture", "Object Classification", "Owner Registry Match", "Event Timeline"],
    price: "₹799/month",
    pricingNote: "Best for facilities that need awareness across objects, assets, and zones.",
    metric: { label: "Objects classified", value: "1.2M" },
    accent: "blue",
  },
  {
    id: "threat",
    name: "Threat Detection",
    route: routes.threatDetection,
    title: "Protect Your Environment with Intelligent Threat Detection",
    summary: "Detects smoke, fire, intrusion, robbery patterns, and active risk events.",
    description:
      "Turn passive camera feeds into an always-on threat intelligence layer with prioritised alerts and forensic context.",
    capabilities: ["Fire and smoke", "Intrusion events", "Robbery signals"],
    features: ["Intrusion recognition", "Fire and smoke analysis", "Priority incident escalation"],
    workflow: ["Continuous Monitoring", "AI Threat Analysis", "Threat Identification", "Instant Alert System"],
    price: "₹1,499/month",
    pricingNote: "Includes high-priority risk models and incident escalation workflows.",
    metric: { label: "Alert latency", value: "<50ms" },
    scenarios: [
      {
        title: "Fire Detection",
        description: "Detect indoor and outdoor fire incidents. Automatically generate emergency alerts.",
        highlights: ["Smoke plume analysis", "Thermal event patterns"],
        priority: "High Priority Event",
      },
      {
        title: "Robbery Detection",
        description:
          "Identify suspicious activity and dangerous situations involving harmful weapons. Trigger immediate security alerts.",
        highlights: ["Weapon identification", "Abnormal behavior analysis"],
      },
    ],
    animalIntrusion: {
      title: "Animal Intrusion",
      description: "Recognize dogs, cows, elephants and other animals entering restricted areas. Generate intrusion warnings.",
      categories: ["Dogs", "Livestock", "Wildlife", "Pests"],
    },
    accent: "red",
  },
  {
    id: "weapon",
    name: "Weapon Detection",
    route: routes.weaponDetection,
    title: "Detect Dangerous Weapons Before They Become Threats",
    summary: "Identifies firearms, knives, and blunt tools across supported camera feeds.",
    description:
      "Detect weapon-like objects before incidents escalate with confidence overlays, evidence retention, and live alerting.",
    capabilities: ["Gun identification", "Knife detection", "Blunt tool recognition"],
    features: ["Gun Detection", "Knife Detection", "Hammer Detection", "Evidence History", "Real-Time Alerts"],
    workflow: ["Frame Analysis", "Weapon Signature Match", "Evidence Capture", "Security Alert"],
    price: "₹1999/month per camera",
    pricingNote: "Priced per camera for high-risk zones and sensitive entrances.",
    metric: { label: "Evidence retention", value: "30 days" },
    accent: "rose",
  },
  {
    id: "accident",
    name: "Accident Detection",
    route: routes.accidentDetection,
    title: "Respond Faster with Intelligent Accident Detection",
    summary: "Monitors for vehicle collisions, human falls, and emergency motion patterns.",
    description:
      "Identify accidents and emergency events quickly so teams can respond with speed, context, and confidence.",
    capabilities: ["Vehicle collision", "Human fall", "Medical emergency"],
    features: ["Vehicle Accident", "Human Fall", "Workplace Incident", "Emergency Event"],
    workflow: ["Motion Monitoring", "Impact Detection", "Incident Classification", "Emergency Dispatch"],
    price: "Custom pricing",
    pricingNote: "Configured around site type, camera count, and emergency response workflow.",
    metric: { label: "Emergency classes", value: "12+" },
    accent: "emerald",
  },
];

export const detectionModules = allDetectionModules.filter(
  (module) => module.id === "object" || module.id === "accident",
);

export const moduleById = detectionModules.reduce<Record<DetectionModuleId, DetectionModule>>(
  (modules, module) => ({
    ...modules,
    [module.id]: module,
  }),
  {} as Record<DetectionModuleId, DetectionModule>,
);
