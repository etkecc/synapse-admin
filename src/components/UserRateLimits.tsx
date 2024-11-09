import { Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useDataProvider, useNotify, useRecordContext, useTranslate } from "react-admin";
import { TextField } from "@mui/material";
import { useFormContext } from "react-hook-form";

const RateLimitRow = ({ limit, value, updateRateLimit }: { limit: string, value: any, updateRateLimit: (limit: string, value: any) => void }) => {
  const translate = useTranslate();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    if (isNaN(value)) {
      updateRateLimit(limit, null);
      return;
    }
    updateRateLimit(limit, value);
  };

  return <Stack
    spacing={1}
    alignItems="start"
    sx={{
        padding: 2,
    }}
  >
    <TextField
      id="outlined-number"
      type="number"
      value={value}
      onChange={handleChange}
      slotProps={{
        inputLabel: {
          shrink: true,
        },
      }}
      label={translate(`resources.users.limits.${limit}`)}
    />
    <Stack>
      <Typography
        variant="body2"
        color="text.secondary"
      >
        {translate(`resources.users.limits.${limit}_text`)}
      </Typography>
    </Stack>
  </Stack>
}

export const UserRateLimits = () => {
  const translate = useTranslate();
  const notify = useNotify();
  const record = useRecordContext();
  const form = useFormContext();
  const dataProvider = useDataProvider();
  const [rateLimits, setRateLimits] = useState({
    messages_per_second: "", // we are setting string here to make the number field empty by default, null is prohibited by the field validation
    burst_count: "",
  });

  if (!record) {
    return null;
  }

  useEffect(() => {
      const fetchRateLimits = async () => {
          const rateLimits = await dataProvider.getRateLimits(record.id);
          if (Object.keys(rateLimits).length > 0) {
            setRateLimits(rateLimits);
          }
      }

      fetchRateLimits();
  }, []);

  const updateRateLimit = async (limit: string, value: any) => {
    let updatedRateLimits = { ...rateLimits, [limit]: value };
    setRateLimits(updatedRateLimits);
    form.setValue(`rates.${limit}`, value, { shouldDirty: true });
  };

  return <>
    <Stack
      direction="column"
    >
      {Object.keys(rateLimits).map((limit: string) =>
        <RateLimitRow
          key={limit}
          limit={limit}
          value={rateLimits[limit]}
          updateRateLimit={updateRateLimit}
        />
      )}
    </Stack>
  </>
};
