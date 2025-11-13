import { Card, CardBody } from "@heroui/react";
import { info } from "../services/settings";
import dayjs from "dayjs";
import { HammerIcon } from "lucide-react";

export const BuildInfo = () => {
  const date = dayjs(info.buildDate).format("DD.MM.YYYY HH:mm:ss");

  return (
    <Card className="flex flex-col gap-2">
      <CardBody className="flex flex-col gap-2">
        <div>{`Дата сборки: ${date}`}</div>
        <div className="flex flex-row gap-2">
          <HammerIcon className="size-6 text-secondary" />
          {info.buildVersion}
        </div>
      </CardBody>
    </Card>
  );
};
