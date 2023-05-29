"use client";
import { ClientSide, Keyring, fetch, usePage } from "@shared/client";
import { twMerge } from "tailwind-merge";

interface KeyringViewProps {
  className?: string;
  keyring: fetch.Keyring;
  siteKey?: string;
}
export const General = ({ className, keyring, siteKey }: KeyringViewProps) => {
  const { l } = usePage();
  return (
    <div className={twMerge(`flex flex-col gap-2`, className)}>
      <div>
        <div className="font-bold">{l("keyring.accountId")}</div>
        <p className="text-base">{keyring.accountId}</p>
      </div>
      <div>
        <div className="font-bold">{l("keyring.password")}</div>
        <p className="text-base">
          ********{" "}
          {keyring.verifies.includes("phone") ? (
            <Keyring.Util.ChangePasswordWithPhone />
          ) : siteKey ? (
            <Keyring.Util.ChangePassword siteKey={siteKey} />
          ) : null}
        </p>
      </div>
    </div>
  );
};

interface CryptoProps {
  className?: string;
  keyring: fetch.Keyring;
  walletPolicy?: "single" | "multple";
}
export const Crypto = ({ className, keyring, walletPolicy = "single" }: CryptoProps) => {
  return (
    <div className={className}>
      <h3 className="mb-0 text-base font-bold">Crypto Wallets</h3>
      <div className="flex flex-col items-baseline md:flex-row">
        <div className="mr-2 text-base">
          {keyring.wallets.map((wallet) => (
            <div key={wallet.id}>
              <span className="mr-4 break-all">{wallet.address}</span>
              <ClientSide>
                <Keyring.Util.SignsubWallet id={wallet.id} />
              </ClientSide>
            </div>
          ))}
        </div>
        {(walletPolicy === "multple" || !keyring.wallets.length) && <Keyring.Util.SignaddWallet />}
      </div>
    </div>
  );
};
