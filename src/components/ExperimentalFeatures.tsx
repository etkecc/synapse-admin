import { useRecordContext } from "react-admin";
import { useNotify } from "react-admin";
import { useDataProvider } from "react-admin";
import { useState, useEffect } from "react";
import { Stack, Switch, Typography } from "@mui/material";
import { ExperimentalFeaturesModel, SynapseDataProvider } from "../synapse/dataProvider";

const experimentalFeaturesMap = {
    msc3881: "enable remotely toggling push notifications for another client",
    msc3575: "enable experimental sliding sync support",
};
const ExperimentalFeatureRow = (props: { featureKey: string, featureValue: boolean, updateFeature: (feature_name: string, feature_value: boolean) => void}) => {
    const featureKey = props.featureKey;
    const featureValue = props.featureValue;
    const featureDescription = experimentalFeaturesMap[featureKey] ?? "";
    const [checked, setChecked] = useState(featureValue);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setChecked(event.target.checked);
      props.updateFeature(featureKey, event.target.checked);
    };

    return <Stack
        direction="row"
        spacing={2}
        alignItems="start"
        sx={{
            padding: 2,
            borderRadius: 1,
            backgroundColor: "background.paper",
            "&:hover": {
                backgroundColor: "action.hover"
            }
        }}
    >
        <Switch checked={checked} onChange={handleChange} />
        <Stack>
            <Typography
                variant="subtitle1"
                sx={{
                    fontWeight: "medium",
                    color: "text.primary"
                }}
            >
                {featureKey}
            </Typography>
            <Typography
                variant="body2"
                color="text.secondary"
            >
                {featureDescription}
            </Typography>
        </Stack>
    </Stack>
}

export const ExperimentalFeaturesList = () => {
    const record = useRecordContext();
    const notify = useNotify();
    const dataProvider = useDataProvider() as SynapseDataProvider;
    const [features, setFeatures] = useState({});
    if (!record) {
        return null;
    }

    useEffect(() => {
        const fetchFeatures = async () => {
        const features = await dataProvider.getFeatures(record.id);
        setFeatures(features);
        }

        fetchFeatures();
    }, []);

    const updateFeature = async (feature_name: string, feature_value: boolean) => {
        const updatedFeatures = {...features, [feature_name]: feature_value} as ExperimentalFeaturesModel;
        setFeatures(updatedFeatures);
        const reponse = await dataProvider.updateFeatures(record.id, updatedFeatures);
        notify("ra.notification.updated", {
            messageArgs: { smart_count: 1 },
            type: "success",
        });
    };

    return <>
        <Stack
            direction="column"
            spacing={1}
        >
            {Object.keys(features).map((featureKey: string) =>
                <ExperimentalFeatureRow
                    key={featureKey}
                    featureKey={featureKey}
                    featureValue={features[featureKey]}
                    updateFeature={updateFeature}
                />
            )}
        </Stack>
    </>
}
