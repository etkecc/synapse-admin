const transformCommandsToChoices = (commands: Record<string, any>) => {
  return Object.entries(commands).map(([key, value]) => ({
    id: key,
    name: value.name,
    description: value.description,
  }));
};

const ScheduledCommandCreate = () => {
  const commandChoices = transformCommandsToChoices(serverCommands);

  return (
    <SimpleForm>
      <SelectInput
        source="command"
        choices={commandChoices}
        optionText={choice => `${choice.name} - ${choice.description}`}
      />
    </SimpleForm>
  );
};
