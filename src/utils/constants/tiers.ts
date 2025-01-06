import { bronzeBg, bronzeIcon, eagleBg, eagleIcon, eliteBg, eliteIcon, guardianBg, guardianIcon, novaBg, novaIcon } from "@/assets";

export type TierNames = "bronze" | "nova" | "guardian" | "eagle" | "elite"

type ITiers = {
    [property in TierNames] : {
        name: string;
        icon: string;
        color: string;
        bg: string
    }
}

export const tiers: ITiers = {
    bronze: {
        name: "Bronze",
        icon: bronzeIcon,
        color: "#D7B68E",
        bg: bronzeBg
    },
    nova: {
        name: "Nova",
        icon: novaIcon,
        color: "#DFE7EA",
        bg: novaBg
    },
    guardian: {
        name: "Guardian",
        icon: guardianIcon,
        color: "#AEEAB9",
        bg: guardianBg
    },
    eagle: {
        name: "Eagle",
        icon: eagleIcon,
        color: "#A7CFF8",
        bg: eagleBg
    },
    elite:{
        name: "Elite",
        icon: eliteIcon,
        color: "#FF4430",
        bg: eliteBg
    }
}