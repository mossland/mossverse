import { useEffect } from "react";
import styled from "styled-components";
import { store, gql } from "@decentverse/data-access";

interface CharacterBoxProps {
  type: "user" | "guest";
}
export const CharacterBox = ({ type }: CharacterBoxProps) => {
  const selected = store.character.use.character();
  const characterList = store.character.use.characterList();
  const initCharacter = store.character.use.initCharacter();
  useEffect(() => {
    (async () => {
      await initCharacter({
        query: type === "guest" ? { name: "default", status: "inactive" } : { status: "inactive" },
      });
      store.character.setState({ character: characterList[0] });
    })();
  }, [characterList]);

  if (characterList === "loading") return <div>Loading...</div>;
  return (
    <CharacterBoxContainer>
      <div className="choice-box">
        {characterList.map((character, idx) => {
          console.log(character.file);
          return (
            <CharacaterImage
              key={idx}
              selected={character === selected}
              onClick={() => store.character.setState({ character })}
            >
              <div className="Image-wrapper">
                <img src={character.file.url} />
                <div className="image-deco"></div>
              </div>
            </CharacaterImage>
          );
        })}
        {/* {characterList.map((character, idx) => (
          <CharacaterImage
            key={idx}
            selected={character === selected}
            onClick={() => store.character.setState({ character })}
          >
            <div className="Image-wrapper">
              <img src={character.file.url} />
              <div className="image-deco"></div>
            </div>
          </CharacaterImage>
        ))} */}
      </div>
      <div className="selected-character">{selected?.file.url && <img src={selected?.file.url} />}</div>
    </CharacterBoxContainer>
  );
};

const CharacterBoxContainer = styled.div`
  .choice-box {
    display: flex;
    padding: 28px;
    justify-content: space-between;
  }
  .selected-character {
    position: relative;
    width: 80px;
    height: 170px;
    overflow: hidden;
    margin: 0 auto;
    img {
      width: 211%;
      image-rendering: pixelated;
      -webkit-user-drag: none;
      top: -15px;
      position: absolute;
      left: -5px;
    }
  }
`;

const CharacaterImage = styled.div<{ selected: boolean }>`
  .Image-wrapper {
    position: relative;
    width: 56px;
    height: 56px;
    border: 2px solid #000;
    border-color: ${(props) => (props.selected ? "white" : "#555555")};
    background-color: #cdcecf;
    overflow: hidden;
    border-radius: 8px;
    cursor: pointer;

    img {
      position: absolute;
      top: -6px;
      left: -6px;
      width: 226%;
      image-rendering: pixelated;
      -webkit-user-drag: none;
    }
    .image-deco {
      width: 56px;
      height: 56px;
      background-color: #cdcecf;
      position: absolute;
      top: 48px;
      left: 0px;
    }
  }
`;
