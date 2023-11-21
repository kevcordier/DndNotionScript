const { Client } = require("@notionhq/client");
const util = require("util");

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
  timeoutMs: 120000,
});
const monstersDBId = process.env.MONSTER_DB_ID;
const passifDBId = process.env.PASSIF_DB_ID;
const actionDBId = process.env.ACTION_DB_ID;

const getValue = (propertyBlock) => {
  return (
    propertyBlock?.plain_text ??
    propertyBlock?.name ??
    propertyBlock?.number ??
    propertyBlock?.url ??
    propertyBlock?.string ??
    propertyBlock?.id ??
    propertyBlock
  );
};

const getPropertyValue = (page, property, join = true) => {
  const p = page.properties[property][page.properties[property].type];
  return !Array.isArray(p)
    ? getValue(p)
    : join
    ? p.map(getValue).join(", ")
    : p.map(getValue);
};

const propertyNames = {
  "Jet de sauvegarde": "Jet de sauvegarde",
  Compétences: "Compétences",
  Vulnérabilités: "Vulnérabilités au dégâts",
  Résistances: "Résistances aux dégâts",
  "Immunités (dégâts)": "Immunités contre les dégâts",
  "Immunités (états)": "Immunités contre les états",
  Sens: "Sens",
  Langues: "Langues",
  "Facteur de puissance": "Facteur de puissance",
  "Bonus de maîtrise": "Bonus de maîtrise",
};

const linkToFinds = {
  "Perception des vibrations":
    "https://www.notion.so/Statistiques-f59d691ede6e40569d64a5277a61939c#def1713b7113420bbea087dfa0cefce4",
  "Vision aveugle":
    "https://www.notion.so/Statistiques-f59d691ede6e40569d64a5277a61939c#96bf188cba7748a19cb192254321ebe4",
  "Vision dans le noir":
    "https://www.notion.so/Statistiques-f59d691ede6e40569d64a5277a61939c#4eb99a82e51048a0b7ca164276754b3c",
  "Vision lucide":
    "https://www.notion.so/Statistiques-f59d691ede6e40569d64a5277a61939c#8117257f91544d57aefe5a0f94edcae6",
  Télépathie:
    "https://www.notion.so/Statistiques-f59d691ede6e40569d64a5277a61939c#c26a2869535a4a85ba73a74addc0e738",
  Athlétisme:
    "https://www.notion.so/Athl-tisme-3262df6521d0499792b2e36b065b0d3c",
  Acrobaties:
    "https://www.notion.so/Acrobaties-799309cefa234a79b726c13573842414",
  Discrétion:
    "https://www.notion.so/Discr-tion-a769381bbe1e48b9baff2f40b25b9f65",
  Escamotage:
    "https://www.notion.so/Escamotage-141addf4efc14ac8ae4280281054bafa",
  Arcanes: "https://www.notion.so/Arcanes-1e61f910a20545dd83da574ff23ac7cc",
  Histoire: "https://www.notion.so/Histoire-d3f0a0d977c74c43abe7680b6caa5be0",
  Investigation:
    "https://www.notion.so/Investigation-994ecf18b42b403b8392141eb3714fa9",
  Nature: "https://www.notion.so/Nature-beaf69152b054fb7826e2e0cfa2d1e24",
  Religion: "https://www.notion.so/Religion-e627556b004b4801b2e0f9908e376dcb",
  Dressage: "https://www.notion.so/Dressage-08135d6146dc4d1a99a1d5af519b4bdf",
  Intuition: "https://www.notion.so/Intuition-c8d31ae3173f499283041d578e2b846d",
  Médecine: "https://www.notion.so/M-decine-e8a1377f47054e27a5fb69ec9088eba2",
  Perception:
    "https://www.notion.so/Perception-3ba326e4157f45548fc14372d17ce301",
  Survie: "https://www.notion.so/Survie-ca009962fb5347288d4a36ec0ad6689b",
  Intimidation:
    "https://www.notion.so/Intimidation-9d111c5acacb40d3abd877cd59087208",
  Persuasion:
    "https://www.notion.so/Persuasion-5367149c2e2945fe95cd8cd7a18fef9f",
  Représentation:
    "https://www.notion.so/Repr-sentation-aa60fc6bae354d049bb8aa5839c4ca49",
  Tromperie: "https://www.notion.so/Tromperie-4520e474f49d4d7fa10d733fabb720ac",
  Épuisement:
    "https://www.notion.so/puisement-e137b18a520844b9aa138d230fa47f36",
  Épuisé: "https://www.notion.so/puisement-e137b18a520844b9aa138d230fa47f36",
  Pétrifié: "https://www.notion.so/P-trifi-19efc91d89224ec3af606f04d32475f6",
  Paralysé: "https://www.notion.so/Paralys-9987d7182c9f4daf94bc5986b11c8568",
  Neutralisé:
    "https://www.notion.so/Neutralis-eae82e9e54344c7887534127e192de97",
  Invisible: "https://www.notion.so/Invisible-4e580d92e7e242fd85692dbf439f0d76",
  Inconscient:
    "https://www.notion.so/Inconscient-e00b5de68e4e4a26b27156530d8e1528",
  Étourdi: "https://www.notion.so/tourdi-744b60fa5aca419aa6c58df66ead25f6",
  Entravé: "https://www.notion.so/Entrav-b386a7d5635247bcbcc4dc30d24235e4",
  Empoisonné:
    "https://www.notion.so/Empoisonn-3753487db9a04b41bfb8063cf06e08d0",
  Effrayé: "https://www.notion.so/Effray-e8719e2827e84cb9b28e4b4541180047",
  Charmé: "https://www.notion.so/Charm-6a2f4e6267b64a7aa187970516623d0f",
  Aveuglé: "https://www.notion.so/Aveugl-db3928e3a6ec4eada8013e023b059a1a",
  Assourdi: "https://www.notion.so/Assourdi-aecaa71ba8e34f58af43c1619a4a6254",
  Agrippé: "https://www.notion.so/Agripp-6c9525b13c42481b92deec79acc4d64e",
  "À terre": "https://www.notion.so/terre-270b941771654c21bf3083d0861b4a75",
};

const getIndicesOf = (str, searchStr) => {
  const searchStrLen = searchStr.length;
  if (searchStrLen == 0) {
    return [];
  }
  let startIndex = 0;
  let index = undefined;
  const indices = [];
  while ((index = str.indexOf(searchStr, startIndex)) > -1) {
    indices.push(index);
    startIndex = index + searchStrLen;
  }
  return indices;
};

const getContentBlockWithLink = (property, exceptPerception) => {
  const blocks = [];
  const toReplaces = [];
  // eslint-disable-next-line no-unused-vars
  const { Perception, ...linkToFindsSansPerception } = linkToFinds;
  const links = exceptPerception ? linkToFindsSansPerception : linkToFinds;
  Object.entries(links).forEach(([text, link]) => {
    const indexes = getIndicesOf(property, text);
    indexes.forEach((index) => {
      toReplaces.push({
        start: index,
        end: index + text.length,
        link,
      });
    });
  });
  let startIndex = 0;
  toReplaces
    .sort((a, b) => a.start - b.start)
    .forEach(({ start, end, link }) => {
      const text = property.slice(startIndex, start);
      if (text.length > 0) {
        blocks.push({
          text: {
            content: text,
          },
        });
      }

      const content = property.slice(start, end);
      blocks.push({
        text: {
          content,
          link: { url: link },
        },
      });
      startIndex = end;
    });
  const content = property.slice(startIndex);
  if (content.length > 0) {
    blocks.push({
      text: {
        content,
      },
    });
  }

  return blocks;
};

const getBlock = (
  name,
  property,
  parseLink = true,
  exceptPerception = false
) => {
  const contentBlocks = parseLink
    ? getContentBlockWithLink(property, exceptPerception)
    : [
        {
          text: {
            content: property,
          },
        },
      ];
  return {
    paragraph: {
      rich_text: [
        {
          text: {
            content: `${name} `,
          },
          annotations: {
            bold: true,
          },
        },
        ...contentBlocks,
      ],
    },
  };
};

const getPropertyBlock = (page, type, name, parseLink = true) => {
  const property = getPropertyValue(page, type);
  return property ? getBlock(name, property, parseLink) : undefined;
};

const competences = {
  Acrobaties: "Dex",
  Arcanes: "Int",
  Athlétisme: "For",
  Discrétion: "Dex",
  Dressage: "Sag",
  Escamotage: "Dex",
  Histoire: "Int",
  Intimidation: "Cha",
  Intuition: "Sag",
  Investigation: "Int",
  Médecine: "Sag",
  Nature: "Int",
  Perception: "Sag",
  Persuasion: "Cha",
  Religion: "Int",
  Représentation: "Cha",
  Survie: "Sag",
  Tromperie: "Cha",
};

const displayStat = (stat) => {
  return `${stat >= 0 ? "+" : ""}${stat}`;
};

const getCompetenceStats = (page) => {
  const bonus = getPropertyValue(page, "Bonus de maîtrise");

  if (isNaN(bonus)) {
    return [
      ...getPropertyValue(page, "Expertise", false).map((comp) => {
        const competence = competences[comp];
        if (!competence) {
          return comp;
        }
        const compBonus = `${displayStat(
          getPropertyValue(page, "Mod" + competence)
        )} plus BM x 2`;
        return `${comp} ${compBonus}`;
      }),
      ...getPropertyValue(page, "Compétences", false).map((comp) => {
        const competence = competences[comp];
        if (!competence) {
          return comp;
        }
        const compBonus = `${displayStat(
          getPropertyValue(page, "Mod" + competence)
        )} plus BM`;
        return `${comp} ${compBonus}`;
      }),
    ];
  }

  return [
    ...getPropertyValue(page, "Expertise", false).map((comp) => {
      const competence = competences[comp];
      if (!competence) {
        return comp;
      }
      const compBonus = bonus * 2 + getPropertyValue(page, "Mod" + competence);
      return `${comp} ${displayStat(compBonus)}`;
    }),
    ...getPropertyValue(page, "Compétences", false).map((comp) => {
      const competence = competences[comp];
      if (!competence) {
        return comp;
      }
      const compBonus = bonus + getPropertyValue(page, "Mod" + competence);
      return `${comp} ${displayStat(compBonus)}`;
    }),
  ];
};

const getSaveStats = (page) => {
  const bonus = getPropertyValue(page, "Bonus de maîtrise");
  return [
    ...getPropertyValue(page, "Jet de sauvegarde", false).map((comp) => {
      const compBonus = isNaN(bonus)
        ? `${displayStat(getPropertyValue(page, "Mod" + comp))} plus BM`
        : displayStat(bonus + getPropertyValue(page, "Mod" + comp));
      return `${comp} ${compBonus}`;
    }),
  ];
};

const getAvailablePropertyBlocks = (page) => {
  return Object.entries(propertyNames).reduce(
    (blocks, [type, propertyName]) => {
      if (type === "Sens") {
        const property = getPropertyValue(page, "Sens");
        const block = getBlock("Sens", property || "", true, true);
        block.paragraph.rich_text.push({
          text: {
            content: `${
              block.paragraph.rich_text.length > 1 ? ", " : ""
            }Perception passive ${getPropertyValue(
              page,
              "Perception passive"
            )}`,
          },
        });

        return [...blocks, block];
      }

      if (type === "Compétences") {
        const competences = getCompetenceStats(page);
        return competences.length > 0
          ? [...blocks, getBlock("Compétences", competences.join(", "))]
          : blocks;
      }

      if (type === "Jet de sauvegarde") {
        const competences = getSaveStats(page);
        return competences.length > 0
          ? [
              ...blocks,
              getBlock("Jet de sauvegarde", competences.join(", "), false),
            ]
          : blocks;
      }

      if (type === "Facteur de puissance") {
        let powerLvl =
          page.properties["Facteur de puissance"][
            page.properties["Facteur de puissance"].type
          ];
        powerLvl = powerLvl === 0.125 ? "1/8" : powerLvl;
        powerLvl = powerLvl === 0.25 ? "1/4" : powerLvl;
        powerLvl = powerLvl === 0.5 ? "1/2" : powerLvl;
        powerLvl = powerLvl === 0 ? "0" : powerLvl;
        return powerLvl
          ? [
              ...blocks,
              getBlock(
                "Facteur de puissance",
                `${powerLvl} (${getPropertyValue(page, "XP")} PX)`,
                false
              ),
            ]
          : blocks;
      }

      if (type === "Bonus de maîtrise") {
        const bonus = getPropertyValue(page, "Bonus de maîtrise") || 2;
        return [
          ...blocks,
          {
            paragraph: {
              rich_text: [
                {
                  text: {
                    content: "Bonus de maîtrise ",
                  },
                  annotations: {
                    bold: true,
                  },
                },
                {
                  text: {
                    content: isNaN(bonus) ? bonus : displayStat(bonus),
                  },
                },
              ],
            },
          },
        ];
      }

      if (type === "Langues") {
        const langues = getPropertyValue(page, "Langues") || "-";
        return [...blocks, getBlock("Langues", langues)];
      }

      const p = getPropertyBlock(page, type, propertyName);

      return p ? [...blocks, p] : blocks;
    },
    []
  );
};

const getPassifBlocks = async (passifs, title = null, description = null) => {
  if (passifs.length === 0) {
    return [];
  }

  const passifBloks = [];
  if (title) {
    passifBloks.push({
      heading_2: {
        rich_text: [
          {
            text: {
              content: title,
            },
          },
        ],
      },
    });
  }
  if (description) {
    passifBloks.push({
      paragraph: {
        rich_text: [
          {
            text: {
              content: description,
            },
          },
        ],
      },
    });
  }
  for (const id in passifs) {
    if (passifs[id]) {
      const passif = passifs[id];
      const content = await notion.blocks.children.list({
        block_id: passif.id,
      });

      content.results.map((block, i) => {
        if (block[block.type].rich_text.length === 0) {
          return;
        }
        const richText = [];
        if (i === 0) {
          richText.push({
            text: {
              content: `${passif.properties.Nom.title[0].plain_text}. `,
            },
            annotations: {
              bold: true,
            },
          });
        }

        richText.push(...block[block.type].rich_text);

        passifBloks.push({
          [block.type]: {
            rich_text: richText,
          },
        });
      });
    }
  }

  return passifBloks;
};

const imagePerType = {
  Humanoïde: "https://www.dndbeyond.com/attachments/2/656/humanoid.jpg",
  Aberration: "https://www.dndbeyond.com/attachments/2/647/aberration.jpg",
  Bête: "https://www.dndbeyond.com/attachments/2/648/beast.jpg",
  Nuée: "https://www.dndbeyond.com/attachments/2/648/beast.jpg",
  Céleste:
    "https://www.dndbeyond.com/content/1-0-2583-0/skins/waterdeep/images/icons/monsters/celestial.jpg",
  Artificiel:
    "https://www.dndbeyond.com/content/1-0-2583-0/skins/waterdeep/images/icons/monsters/construct.jpg",
  Dragon:
    "https://www.dndbeyond.com/content/1-0-2583-0/skins/waterdeep/images/icons/monsters/dragon.jpg",
  Élémentaire:
    "https://www.dndbeyond.com/content/1-0-2583-0/skins/waterdeep/images/icons/monsters/elemental.jpg",
  Fée: "https://www.dndbeyond.com/content/1-0-2583-0/skins/waterdeep/images/icons/monsters/fey.jpg",
  Fiélon:
    "https://www.dndbeyond.com/content/1-0-2583-0/skins/waterdeep/images/icons/monsters/fiend.jpg",
  Géant:
    "https://www.dndbeyond.com/content/1-0-2583-0/skins/waterdeep/images/icons/monsters/giant.jpg",
  Monstruosité:
    "https://www.dndbeyond.com/content/1-0-2583-0/skins/waterdeep/images/icons/monsters/monstrosity.jpg",
  Vase: "https://www.dndbeyond.com/content/1-0-2583-0/skins/waterdeep/images/icons/monsters/ooze.jpg",
  Plante:
    "https://www.dndbeyond.com/content/1-0-2583-0/skins/waterdeep/images/icons/monsters/plant.jpg",
  "Mort-vivant":
    "https://www.dndbeyond.com/content/1-0-2583-0/skins/waterdeep/images/icons/monsters/undead.jpg",
};

const getStatDisplay = (page, stat) => {
  const mod = getPropertyValue(page, "Mod" + stat);
  return `${getPropertyValue(page, stat)} (${displayStat(mod)})`;
};

(async () => {
  do {
    let monstarList;
    try {
      monstarList = await notion.databases.query({
        database_id: monstersDBId,
        filter: {
          property: "Complet",
          status: {
            equals: "To transform",
          },
        },
        sorts: [
          {
            property: "Nom",
            direction: "ascending",
          },
        ],
        page_size: 20,
      });
    } catch (error) {
      continue;
    }

    if (monstarList.results.length === 0) {
      return;
    }

    for (const monstreIndex in monstarList.results) {
      if (monstarList.results[monstreIndex]) {
        try {
          const { id, object } = monstarList.results[monstreIndex];

          if (object !== "page") {
            return;
          }

          const page = await notion.pages.retrieve({ page_id: id });

          console.info(
            "-----------------------------",
            id,
            page.properties.Nom.title[0].plain_text,
            "-----------------------------"
          );
          const pageBlocks = await notion.blocks.children.list({
            block_id: id,
            page_size: 50,
          });
          for (let i = 0; i < pageBlocks.results.length; i++) {
            await notion.blocks.delete({
              block_id: pageBlocks.results[i].id,
            });
          }
          console.info("Page reset");

          const passifList = await notion.databases.query({
            database_id: passifDBId,
            filter: {
              property: "👺 Créatures",
              relation: {
                contains: id,
              },
            },
            sorts: [
              {
                property: "Nom",
                direction: "ascending",
              },
            ],
          });

          const actionListRequest = await notion.databases.query({
            database_id: actionDBId,
            filter: {
              property: "👺 Créatures",
              relation: {
                contains: id,
              },
            },
            sorts: [
              {
                property: "Nom",
                direction: "ascending",
              },
            ],
          });

          const actionList = actionListRequest.results;
          actionList.sort(
            (result1, result2) =>
              new Date(result1["created_time"]).getTime() -
              new Date(result2["created_time"]).getTime()
          );

          const [principalType, ...types] = getPropertyValue(
            page,
            "Type",
            false
          );
          const type =
            principalType +
            (types.length > 0
              ? ` (${types.map((type) => type.toLowerCase()).join(", ")})`
              : "");

          const footer = [
            {
              divider: {},
            },
          ];

          const properties = {
            Complet: {
              status: {
                name: "To validate",
              },
            },
          };

          const image =
            page.properties["Image"][page.properties["Image"].type]
              ?.replace("jpg", "webp")
              .replace("jpeg", "webp")
              .replace("png", "webp") ?? imagePerType[principalType];
          let cover;
          if (image) {
            cover = {
              type: "external",
              external: {
                url: image,
              },
            };
            footer.push({
              image: {
                type: "external",
                external: {
                  url: image,
                },
              },
            });
            properties["Image"] = {
              url: image,
            };
          }

          const description = getPropertyValue(page, "Description");
          if (description) {
            footer.push({
              paragraph: {
                rich_text: [
                  {
                    text: {
                      content: description,
                    },
                  },
                ],
              },
            });
          }

          const alignement = getPropertyValue(
            page,
            "Alignement"
          )?.toLowerCase();

          const children = [
            {
              paragraph: {
                rich_text: [
                  {
                    text: {
                      content: `${type} de taille ${getPropertyValue(
                        page,
                        "Taille"
                      )?.toLowerCase()}${alignement ? ", " + alignement : ""}`,
                    },
                    annotations: {
                      italic: true,
                    },
                  },
                ],
              },
            },
            {
              divider: {},
            },
            getPropertyBlock(page, "CA", "Classe d'armure"),
            getPropertyBlock(page, "PV", "Points de vie"),
            getPropertyBlock(page, "Vitesse", "Vitesse"),
            {
              divider: {},
            },
            {
              table: {
                table_width: 6,
                has_column_header: true,
                has_row_header: false,
                children: [
                  {
                    table_row: {
                      cells: [
                        [
                          {
                            text: {
                              content: "FOR",
                            },
                            annotations: {
                              bold: true,
                            },
                          },
                        ],
                        [
                          {
                            text: {
                              content: "DEX",
                            },
                            annotations: {
                              bold: true,
                            },
                          },
                        ],
                        [
                          {
                            text: {
                              content: "CON",
                            },
                            annotations: {
                              bold: true,
                            },
                          },
                        ],
                        [
                          {
                            text: {
                              content: "INT",
                            },
                            annotations: {
                              bold: true,
                            },
                          },
                        ],
                        [
                          {
                            text: {
                              content: "SAG",
                            },
                            annotations: {
                              bold: true,
                            },
                          },
                        ],
                        [
                          {
                            text: {
                              content: "CHA",
                            },
                            annotations: {
                              bold: true,
                            },
                          },
                        ],
                      ],
                    },
                  },
                  {
                    table_row: {
                      cells: [
                        [
                          {
                            text: {
                              content: getStatDisplay(page, "For"),
                            },
                          },
                        ],
                        [
                          {
                            text: {
                              content: getStatDisplay(page, "Dex"),
                            },
                          },
                        ],
                        [
                          {
                            text: {
                              content: getStatDisplay(page, "Con"),
                            },
                          },
                        ],
                        [
                          {
                            text: {
                              content: getStatDisplay(page, "Int"),
                            },
                          },
                        ],
                        [
                          {
                            text: {
                              content: getStatDisplay(page, "Sag"),
                            },
                          },
                        ],
                        [
                          {
                            text: {
                              content: getStatDisplay(page, "Cha"),
                            },
                          },
                        ],
                      ],
                    },
                  },
                ],
              },
            },
            {
              divider: {},
            },
            ...getAvailablePropertyBlocks(page),
            {
              divider: {},
            },
            ...(await getPassifBlocks(passifList.results)),
            ...(await getPassifBlocks(
              actionList.filter(
                (action) => getPropertyValue(action, "Type") === "Action"
              ),"ACTIONS"
            )),
            ...(await getPassifBlocks(
              actionList.filter(
                (action) => getPropertyValue(action, "Type") === "Action bonus"
              ), "ACTIONS BONUS"
            )),
            ...(await getPassifBlocks(
              actionList.filter(
                (action) => getPropertyValue(action, "Type") === "Réaction"
              ), "RÉACTIONS"
            )),
            ...(await getPassifBlocks(
              actionList.filter(
                (action) =>
                  getPropertyValue(action, "Type") === "Action légendaire"
              ), "ACTIONS LÉGENDAIRE",
              getPropertyValue(
                page,
                "Actions légendaires"
              )
            )),
            ...footer,
          ];

          try {
            await notion.blocks.children.append({
              block_id: id,
              children,
            });
          } catch (e) {
            console.error(
              "error on children append",
              util.inspect(children, {
                showHidden: false,
                depth: null,
                colors: true,
              })
            );
            throw e;
          }

          await notion.pages.update({
            page_id: id,
            properties,
            cover,
          });
        
          for (let i = 0; i < passifList.results.length; i++) {
            await notion.pages.update({
              page_id: passifList.results[i].id,
              archived: true,
            });
          }
          for (let i = 0; i < actionListRequest.results.length; i++) {
            await notion.pages.update({
              page_id: actionListRequest.results[i].id,
              archived: true,
            });
          }

          console.info(
            id,
            page.properties.Nom.title[0].plain_text,
            "mis à jour"
          );
        } catch (e) {
          console.error(e);
          continue;
        }
      }
    }
  } while (true);
})();
