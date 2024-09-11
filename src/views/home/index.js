import { useState } from "react";

import Header from "./component/Header";
import Experience from "./component/Experience";
import TabButton from "./component/TabButton";
import { EXPERIENCE } from "./data";
import { EXAMPLES } from "./data";

import "./index.css";

function Index() {
  const [selectedTopic, setSelectedTopic] = useState();

  let tabContent = <p>Please select a topic.</p>;

  if (selectedTopic) {
    tabContent = (
      <div id="tab-content">
        <h3>{EXAMPLES[selectedTopic].title}</h3>
        <p>{EXAMPLES[selectedTopic].description}</p>
        <pre>
          <code>{EXAMPLES[selectedTopic].description2}</code>
        </pre>
      </div>
    );
  }

  function handleSelect(selectedButton) {
    setSelectedTopic(selectedButton);
  }

  return (
    <div className="container">
      <Header />
      <main>
        <section id="experience">
          <h2>Experience and Projects</h2>
          <ul>
            {EXPERIENCE.map(({ title, description }) => (
              <Experience key={title} title={title} description={description} />
            ))}
          </ul>
        </section>

        <section id="examples">
          <h2>Leadership & Activities</h2>
          <menu>
            <TabButton
              isSelected={selectedTopic === `google`}
              onSelect={() => handleSelect(`google`)}
            >
              Google Developers Student Club PUP
            </TabButton>
            <TabButton
              isSelected={selectedTopic === `pup`}
              onSelect={() => handleSelect(`pup`)}
            >
              PUP Office of Student Regent
            </TabButton>
            <TabButton
              isSelected={selectedTopic === `ccis`}
              onSelect={() => handleSelect(`ccis`)}
            >
              CCIS Student Council
            </TabButton>
          </menu>
          {tabContent}
        </section>
      </main>
    </div>
  );
}

export default Index;
