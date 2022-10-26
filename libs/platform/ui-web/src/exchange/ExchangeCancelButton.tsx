import React, { ReactNode, useEffect } from "react";
import styled from "styled-components";
import { BiRightArrowAlt, BiChevronLeft } from "react-icons/bi";
import { DefaultButton } from "../common";
import Link from "next/link";

export const ExchangeCancelButton = () => {
  return (
    <Link href="/exchange" passHref>
      <DefaultButton onClick={() => null} block>
        Cancel
      </DefaultButton>
    </Link>
  );
};
