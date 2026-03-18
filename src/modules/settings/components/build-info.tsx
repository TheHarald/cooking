import { observer } from "mobx-react-lite";
import { Card, CardBody } from "@heroui/react";
import { useTranslation } from "react-i18next";
import { info } from "../services/settings";
import dayjs from "../../../dayjs";
import { HammerIcon } from "lucide-react";

export const BuildInfo = observer(() => {
  const { t } = useTranslation();
  const date = dayjs(info.buildDate).format("DD.MM.YYYY HH:mm:ss");

  return (
    <Card className="flex flex-col gap-2">
      <CardBody className="flex flex-col gap-2">
        <div>{t("build-date", { date })}</div>
        <div className="flex flex-row gap-2">
          <HammerIcon className="size-6 text-secondary" />
          {info.buildVersion}
        </div>
      </CardBody>
    </Card>
  );
});
