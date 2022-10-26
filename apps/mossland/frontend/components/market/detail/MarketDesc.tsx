import React from "react";
import styled from "styled-components";

export const MarketDesc = ({ desc }: { desc: string | null }) => {
  return (
    <MarketDescContainer>
      {desc ?? ""}
      {/* By sonyart
      <br />
      <br /> When we found Pastil, his eyes were infected and his mom was missing, we brought him home for his
      treatment, thats how we fell in love with him and he became a member of our family. */}
    </MarketDescContainer>
  );
};

const MarketDescContainer = styled.div`
  padding-top: 26px;
  border-top: 2px solid #000;
  font-size: 18px;
`;
