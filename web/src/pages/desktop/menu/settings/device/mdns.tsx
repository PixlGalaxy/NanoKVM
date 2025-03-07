import { useEffect, useState } from 'react';
import { Switch, Tooltip } from 'antd';
import { CircleAlertIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import * as api from '@/api/vm.ts';

export const Mdns = () => {
  const { t } = useTranslation();

  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    api
      .getMdnsState()
      .then((rsp) => {
        if (rsp.data?.enabled) {
          setIsEnabled(true);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  async function update() {
    if (isLoading) return;
    setIsLoading(true);

    const rsp = isEnabled ? await api.disableMdns() : await api.enableMdns();
    setIsLoading(false);

    if (rsp.code !== 0) {
      console.log(rsp.msg);
      return;
    }

    setIsEnabled(!isEnabled);
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-col">
        <span>mDNS</span>

        <div className="flex items-center space-x-1">
          <span className="text-xs text-neutral-500">{t('settings.device.mdns.description')}</span>
          <Tooltip
            title={t('settings.device.mdns.tip')}
            className="cursor-pointer text-neutral-500"
            placement="bottom"
          >
            <CircleAlertIcon size={16} />
          </Tooltip>
        </div>
      </div>

      <Switch checked={isEnabled} loading={isLoading} onChange={update} />
    </div>
  );
};
