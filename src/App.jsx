import React from "react";
import { jsPDF } from "jspdf";
import productsData from "../prods.json";
import allergensData from "../alergenos/alerjenos.json";

const iconModules = import.meta.glob("../icons/*.{png,svg,jpg,jpeg,webp}", {
  eager: true,
  import: "default"
});

const LANGUAGE_OPTIONS = [
  { code: "es", label: "Español", flagSrc: `${import.meta.env.BASE_URL}flags/es.svg` },
  { code: "en", label: "English", flagSrc: `${import.meta.env.BASE_URL}flags/gb.svg` },
  { code: "fr", label: "Français", flagSrc: `${import.meta.env.BASE_URL}flags/fr.svg` }
];

const UI_TEXT = {
  es: {
    allergens: "Alérgenos",
    detailsSummary: "Detalles y alérgenos",
    viewImage: "Ver imagen",
    closeModal: "Cerrar imagen",
    openAllergens: "Alérgenos",
    closeAllergens: "Cerrar alérgenos",
    exportPdf: "PDF",
    pdfTitle: "Carta completa",
    pdfFileName: "carta-completa.pdf",
    pdfLogoFallback: "Añade tu logotipo en /public/logo.png",
    designBy: "Design by Igsein",
    backToTop: "Ir al inicio",
    empty: "No hay productos disponibles en esta categoría.",
    priceSuffix: "€"
  },
  en: {
    allergens: "Allergens",
    detailsSummary: "Details and allergens",
    viewImage: "View image",
    closeModal: "Close image",
    openAllergens: "Allergens",
    closeAllergens: "Close allergens",
    exportPdf: "PDF",
    pdfTitle: "Full menu",
    pdfFileName: "full-menu.pdf",
    pdfLogoFallback: "Add your logo to /public/logo.png",
    designBy: "Design by Igsein",
    backToTop: "Back to top",
    empty: "There are no products available in this category.",
    priceSuffix: "€"
  },
  fr: {
    allergens: "Allergènes",
    detailsSummary: "Détails et allergènes",
    viewImage: "Voir l'image",
    closeModal: "Fermer l'image",
    openAllergens: "Allergènes",
    closeAllergens: "Fermer les allergènes",
    exportPdf: "PDF",
    pdfTitle: "Carte complète",
    pdfFileName: "carte-complete.pdf",
    pdfLogoFallback: "Ajoutez votre logo dans /public/logo.png",
    designBy: "Design by Igsein",
    backToTop: "Retour en haut",
    empty: "Aucun produit n'est disponible dans cette catégorie.",
    priceSuffix: "€"
  }
};

const allProducts = Array.isArray(productsData) ? productsData : [productsData];
const PDF_LOGO_URL = `${import.meta.env.BASE_URL}logo.png`;

const normalizeText = (value) => {
  if (typeof value !== "string") {
    return "";
  }

  try {
    return decodeURIComponent(escape(value));
  } catch {
    return value;
  }
};

const getLocalizedText = (field, language) => {
  if (!field) {
    return "";
  }

  if (typeof field === "string") {
    return normalizeText(field);
  }

  return normalizeText(field[language] || field.es || field.en || field.fr || "");
};

const getIconNameFromPath = (pathValue) => {
  if (typeof pathValue !== "string") {
    return "";
  }

  const cleanedPath = pathValue.replace("./assets/", "").replace(/^\/+/, "");
  return cleanedPath.split("/").pop() || "";
};

const allergensById = allergensData.reduce((acc, allergen) => {
  const fileName = getIconNameFromPath(allergen.PIC);
  const iconEntry = Object.entries(iconModules).find(([modulePath]) =>
    modulePath.endsWith(`/${fileName}`)
  );

  acc[allergen.ID] = {
    ...allergen,
    icon: iconEntry ? iconEntry[1] : null
  };

  return acc;
}, {});

const formatPrice = (price, language) => {
  const safePrice = typeof price === "number" ? price : Number(price) || 0;

  return new Intl.NumberFormat(
    language === "fr" ? "fr-FR" : language === "en" ? "en-GB" : "es-ES",
    {
      minimumFractionDigits: Number.isInteger(safePrice) ? 0 : 2,
      maximumFractionDigits: 2
    }
  ).format(safePrice);
};

const hasDisplayPrice = (price) => {
  if (typeof price === "number") {
    return true;
  }

  if (typeof price === "string") {
    return price.trim() !== "";
  }

  return false;
};

const getProductImageUrl = (pic) => {
  if (typeof pic !== "string" || !pic.trim()) {
    return null;
  }

  return `${import.meta.env.BASE_URL}assets/${pic.trim()}.jpg`;
};

const toSentenceCase = (value) => {
  const normalized = normalizeText(value).toLowerCase();

  if (!normalized) {
    return "";
  }

  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
};

const blobToDataUrl = (blob) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });

const getImageDimensions = (dataUrl) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      resolve({
        width: image.naturalWidth || image.width,
        height: image.naturalHeight || image.height
      });
    };
    image.onerror = reject;
    image.src = dataUrl;
  });

const loadImageAsset = async (url) => {
  try {
    const response = await fetch(url);
    const contentType = response.headers.get("content-type") || "";

    if (!response.ok || !contentType.startsWith("image/")) {
      return null;
    }

    const blob = await response.blob();
    const dataUrl = await blobToDataUrl(blob);
    const dimensions = await getImageDimensions(dataUrl);

    return {
      dataUrl,
      format: contentType.includes("png") ? "PNG" : "JPEG",
      ...dimensions
    };
  } catch {
    return null;
  }
};

const loadLogoDataUrl = async () => loadImageAsset(PDF_LOGO_URL);

function ProductImage({ pic, alt, onOpen, openLabel }) {
  const imageUrl = getProductImageUrl(pic);
  const [hasError, setHasError] = React.useState(false);

  React.useEffect(() => {
    setHasError(false);
  }, [imageUrl]);

  if (!imageUrl || hasError) {
    return null;
  }

  return (
    <button
      type="button"
      className="product-image-button"
      onClick={() => onOpen?.({ src: imageUrl, alt })}
      aria-label={`${openLabel}: ${alt}`}
    >
      <div className="product-image-wrap">
        <img className="product-image" src={imageUrl} alt={alt} onError={() => setHasError(true)} />
      </div>
    </button>
  );
}

function App() {
  const [language, setLanguage] = React.useState("es");
  const articleRef = React.useRef(null);
  const sectionRefs = React.useRef({});
  const categoryButtonRefs = React.useRef({});
  const [selectedImage, setSelectedImage] = React.useState(null);
  const [isAllergensModalOpen, setIsAllergensModalOpen] = React.useState(false);
  const [showBackToTop, setShowBackToTop] = React.useState(false);

  const groupedProducts = React.useMemo(() => {
    return allProducts.reduce((acc, product) => {
      const category = getLocalizedText(product.TYPE, language) || "Sin categoría";

      if (!acc[category]) {
        acc[category] = [];
      }

      acc[category].push(product);
      return acc;
    }, {});
  }, [language]);

  const categories = Object.keys(groupedProducts);
  const text = UI_TEXT[language];
  const [activeCategory, setActiveCategory] = React.useState("");

  React.useEffect(() => {
    if (!selectedImage && !isAllergensModalOpen) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setSelectedImage(null);
        setIsAllergensModalOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isAllergensModalOpen, selectedImage]);

  React.useEffect(() => {
    if (!categories.length) {
      setActiveCategory("");
      return;
    }

    setActiveCategory((currentCategory) =>
      categories.includes(currentCategory) ? currentCategory : categories[0]
    );
  }, [categories]);

  React.useEffect(() => {
    if (!activeCategory) {
      return;
    }

    const activeButton = categoryButtonRefs.current[activeCategory];
    if (!activeButton) {
      return;
    }

    activeButton.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest"
    });
  }, [activeCategory]);

  const syncActiveCategoryFromScroll = React.useCallback(() => {
    const container = articleRef.current;
    if (!container || !categories.length) {
      return;
    }

    const scrollTop = container.scrollTop;
    const threshold = 80;
    let nextActiveCategory = categories[0];

    categories.forEach((category) => {
      const section = sectionRefs.current[category];

      if (section && section.offsetTop - threshold <= scrollTop) {
        nextActiveCategory = category;
      }
    });

    setActiveCategory((currentCategory) =>
      currentCategory === nextActiveCategory ? currentCategory : nextActiveCategory
    );
  }, [categories]);

  React.useEffect(() => {
    const container = articleRef.current;
    if (!container) {
      return undefined;
    }

    syncActiveCategoryFromScroll();
    container.addEventListener("scroll", syncActiveCategoryFromScroll, { passive: true });

    return () => {
      container.removeEventListener("scroll", syncActiveCategoryFromScroll);
    };
  }, [syncActiveCategoryFromScroll]);

  React.useEffect(() => {
    const container = articleRef.current;
    if (!container) {
      return undefined;
    }

    const handleBackToTopVisibility = () => {
      setShowBackToTop(container.scrollTop > 160);
    };

    handleBackToTopVisibility();
    container.addEventListener("scroll", handleBackToTopVisibility, { passive: true });

    return () => {
      container.removeEventListener("scroll", handleBackToTopVisibility);
    };
  }, []);

  const handleCategoryClick = React.useCallback((category) => {
    const container = articleRef.current;
    const section = sectionRefs.current[category];

    if (!container || !section) {
      return;
    }

    setActiveCategory(category);
    container.scrollTo({
      top: section.offsetTop - 8,
      behavior: "smooth"
    });
  }, []);

  const handleBackToTop = React.useCallback(() => {
    if (!categories.length) {
      return;
    }

    handleCategoryClick(categories[0]);
  }, [categories, handleCategoryClick]);

  const handleExportPdf = React.useCallback(async () => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4"
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const marginX = 8;
    const topY = 8;
    const footerHeight = 6;
    const headerHeight = 1;
    const gap = 4;
    const columnCount = 3;
    const contentTopY = topY + headerHeight;
    const contentBottomY = pageHeight - footerHeight;
    const usableWidth = pageWidth - marginX * 2 - gap * (columnCount - 1);
    const columnWidth = usableWidth / columnCount;
    const logoAsset = await loadLogoDataUrl();
    const uniqueAllergenIcons = [
      ...new Set(
        Object.values(allergensById)
          .map((allergen) => allergen?.icon)
          .filter(Boolean)
      )
    ];
    const allergenIconEntries = await Promise.all(
      uniqueAllergenIcons.map(async (iconUrl) => [iconUrl, await loadImageAsset(iconUrl)])
    );
    const allergenIconMap = Object.fromEntries(allergenIconEntries);

    const addFooter = () => {
      if (logoAsset) {
        const maxLogoWidth = pageWidth - 16;
        const maxLogoHeight = pageHeight - 20;
        const logoWidth = logoAsset.width || maxLogoWidth;
        const logoHeight = logoAsset.height || maxLogoHeight;
        const scale = Math.min(maxLogoWidth / logoWidth, maxLogoHeight / logoHeight);
        const renderWidth = logoWidth * scale;
        const renderHeight = logoHeight * scale;
        const renderX = pageWidth / 2 - renderWidth / 2;
        const renderY = pageHeight / 2 - renderHeight / 2;

        if (typeof doc.GState === "function" && typeof doc.setGState === "function") {
          doc.setGState(new doc.GState({ opacity: 0.16 }));
        }

        doc.addImage(
          logoAsset.dataUrl,
          logoAsset.format,
          renderX,
          renderY,
          renderWidth,
          renderHeight
        );

        if (typeof doc.GState === "function" && typeof doc.setGState === "function") {
          doc.setGState(new doc.GState({ opacity: 1 }));
        }
      } else {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(6.2);
        doc.setTextColor(118, 100, 81);
        doc.text(text.pdfLogoFallback, pageWidth / 2, pageHeight - 5, { align: "center" });
      }
    };

    const addPageFrame = () => {
      addFooter();
    };

    const drawCategoryHeading = (label, x, y) => {
      doc.setFont("times", "bolditalic");
      doc.setFontSize(10);
      doc.setTextColor(41, 39, 35);
      doc.text(label.toUpperCase(), x, y);
      const textWidth = doc.getTextWidth(label.toUpperCase());
      doc.setLineWidth(0.2);
      doc.setDrawColor(118, 100, 81);
      doc.line(x, y + 0.8, x + textWidth, y + 0.8);
    };

    const startNewPage = () => {
      doc.addPage();
      addPageFrame();
      return { column: 0, y: contentTopY };
    };

    const getColumnX = (column) => marginX + column * (columnWidth + gap);
    const nextSlot = (state) => {
      if (state.column < columnCount - 1) {
        return { column: state.column + 1, y: contentTopY };
      }

      return startNewPage();
    };

    const ensureSpace = (state, height) => {
      if (state.y + height <= contentBottomY) {
        return state;
      }

      return nextSlot(state);
    };

    addPageFrame();
    let layoutState = { column: 0, y: contentTopY };

    categories.forEach((category, categoryIndex) => {
      const products = (groupedProducts[category] || []).filter(
        (product) => product.STYLE !== "incremento"
      );

      if (products.length === 0) {
        return;
      }
      layoutState = ensureSpace(layoutState, categoryIndex === 0 ? 7.5 : 8.5);
      let columnX = getColumnX(layoutState.column);

      if (layoutState.y > contentTopY) {
        layoutState.y += 0.4;
      }

      drawCategoryHeading(category, columnX, layoutState.y);

      layoutState.y += 3.8;

      products.forEach((product) => {
        const localizedName = toSentenceCase(getLocalizedText(product.NAME, language));
        const shouldShowPrice = hasDisplayPrice(product.PRICE);
        const isIncrementCard = product.STYLE === "incremento";
        const allergenAssets = (product.ALERG || [])
          .map((id) => allergensById[id])
          .filter(Boolean)
          .map((allergen) => ({
            ...allergen,
            pdfIcon: allergen.icon ? allergenIconMap[allergen.icon] : null
          }));

        doc.setFont("helvetica", isIncrementCard ? "bolditalic" : "bold");
        doc.setFontSize(7.2);
        const titleLines = doc.splitTextToSize(
          localizedName,
          shouldShowPrice ? columnWidth - 13 : columnWidth
        );
        const iconsPerRow = Math.max(1, Math.floor(columnWidth / 4.2));
        const iconRows = !isIncrementCard && allergenAssets.length
          ? Math.ceil(allergenAssets.length / iconsPerRow)
          : 0;
        const blockHeight = titleLines.length * 3.25 + (iconRows ? iconRows * 3.7 + 0.8 : 0) + 1.8;

        layoutState = ensureSpace(layoutState, blockHeight);
        columnX = getColumnX(layoutState.column);

        doc.setFont("helvetica", isIncrementCard ? "bolditalic" : "bold");
        doc.setFontSize(7.2);
        doc.setTextColor(isIncrementCard ? 95 : 41, isIncrementCard ? 80 : 39, isIncrementCard ? 65 : 35);
        doc.text(titleLines, columnX, layoutState.y);

        if (shouldShowPrice) {
          const firstLine = titleLines[0] || "";
          const firstLineWidth = doc.getTextWidth(firstLine);
          const priceText = `${formatPrice(product.PRICE, language)}${text.priceSuffix}`;
          const priceWidth = doc.getTextWidth(priceText);
          const dotsStartX = columnX + firstLineWidth + 1.2;
          const dotsEndX = columnX + columnWidth - priceWidth - 1.2;
          const dotUnit = doc.getTextWidth("...");
          const dotsWidth = dotsEndX - dotsStartX;

          if (dotsWidth > dotUnit * 1.4) {
            const dotsCount = Math.max(1, Math.floor(dotsWidth / dotUnit));
            const dots = "...".repeat(dotsCount);

            doc.setFont("helvetica", "normal");
            doc.setFontSize(6.4);
            doc.setTextColor(160, 150, 138);
            doc.text(dots, dotsStartX, layoutState.y);
          }

          doc.setFont("helvetica", "bold");
          doc.setFontSize(6.8);
          doc.setTextColor(118, 100, 81);
          doc.text(priceText, columnX + columnWidth, layoutState.y, {
            align: "right"
          });
        }

        layoutState.y += titleLines.length * 3.25;

        if (iconRows) {
          let iconX = columnX;
          let iconY = layoutState.y + 0.9;

          allergenAssets.forEach((allergen, allergenIndex) => {
            const rowIndex = Math.floor(allergenIndex / iconsPerRow);
            const columnIndex = allergenIndex % iconsPerRow;
            const currentX = iconX + columnIndex * 4.2;
            const currentY = iconY + rowIndex * 3.7;

            if (allergen.pdfIcon) {
              doc.addImage(allergen.pdfIcon.dataUrl, allergen.pdfIcon.format, currentX, currentY, 2.6, 2.6);
            } else {
              doc.setDrawColor(118, 100, 81);
              doc.circle(currentX + 1.3, currentY + 1.3, 1, "S");
            }
          });

          layoutState.y += iconRows * 3.7 + 0.8;
        }

        layoutState.y += 1.8;
      });

      layoutState.y += 1.8;
    });

    const allergenLegend = Object.values(allergensById)
      .filter(Boolean)
      .map((allergen) => ({
        ...allergen,
        localizedName: toSentenceCase(getLocalizedText(allergen.NAME, language)),
        pdfIcon: allergen.icon ? allergenIconMap[allergen.icon] : null
      }))
      .sort((a, b) => a.localizedName.localeCompare(b.localizedName));

    if (allergenLegend.length) {
      layoutState = ensureSpace(layoutState, categories.length ? 8.5 : 7.5);
      let columnX = getColumnX(layoutState.column);
      const legendGap = 2.6;
      const legendColumnWidth = (columnWidth - legendGap) / 2;

      if (layoutState.y > contentTopY) {
        layoutState.y += 0.4;
      }

      drawCategoryHeading(text.allergens, columnX, layoutState.y);
      layoutState.y += 3.8;

      for (let index = 0; index < allergenLegend.length; index += 2) {
        const rowItems = allergenLegend.slice(index, index + 2).map((allergen) => {
          doc.setFont("helvetica", "bold");
          doc.setFontSize(6.6);

          return {
            ...allergen,
            labelLines: doc.splitTextToSize(allergen.localizedName, legendColumnWidth - 4.4)
          };
        });

        const rowHeight =
          Math.max(
            ...rowItems.map((item) => Math.max(3.1, item.labelLines.length * 2.8) + 1.2)
          );

        layoutState = ensureSpace(layoutState, rowHeight);
        columnX = getColumnX(layoutState.column);

        rowItems.forEach((item, rowIndex) => {
          const itemX = columnX + rowIndex * (legendColumnWidth + legendGap);

          if (item.pdfIcon) {
            doc.addImage(item.pdfIcon.dataUrl, item.pdfIcon.format, itemX, layoutState.y - 2.1, 2.6, 2.6);
          } else {
            doc.setDrawColor(118, 100, 81);
            doc.circle(itemX + 1.3, layoutState.y - 0.8, 1, "S");
          }

          doc.setFont("helvetica", "bold");
          doc.setFontSize(6.6);
          doc.setTextColor(41, 39, 35);
          doc.text(item.labelLines, itemX + 3.5, layoutState.y, {
            align: "left"
          });
        });

        layoutState.y += rowHeight;
      }
    }

    doc.save(text.pdfFileName);
  }, [categories, groupedProducts, language, text]);

  return (
    <div className="app-shell">
      <div className="background-orb orb-one" />
      <div className="background-orb orb-two" />

      <main className="menu-layout">
        <section className="hero-card">
          <button
            type="button"
            className="allergens-trigger"
            onClick={() => setIsAllergensModalOpen(true)}
          >
            {text.openAllergens}
          </button>

          <div className="hero-pdf">
            <button type="button" className="pdf-trigger" onClick={handleExportPdf}>
              <svg
                className="pdf-hint-icon"
                viewBox="0 0 16 16"
                aria-hidden="true"
                focusable="false"
              >
                <path
                  d="M5 1.8h4.7l2.3 2.3v8.1c0 1-.8 1.8-1.8 1.8H5c-1 0-1.8-.8-1.8-1.8V3.6c0-1 .8-1.8 1.8-1.8Z"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.4"
                />
                <path
                  d="M9.7 1.9v2.2h2.2M5.2 7.1h1.3c.7 0 1.2.4 1.2 1.1s-.5 1.1-1.2 1.1H5.2Zm0 0v2M8.8 11.3V7.1h1.4c.8 0 1.3.5 1.3 1.1v2c0 .6-.5 1.1-1.3 1.1Zm-3.6 0h1.1m2.5-2.1h1.6"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.1"
                />
                <path
                  d="M8 5.4v3.1m0 0 1.6-1.6M8 8.5 6.4 6.9M5.8 10.4h4.4"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.15"
                />
              </svg>
              <span>{text.exportPdf}</span>
            </button>
          </div>

          <div className="language-switcher" aria-label="Selector de idioma">
            {LANGUAGE_OPTIONS.map((option) => (
              <button
                key={option.code}
                type="button"
                className={option.code === language ? "active" : ""}
                onClick={() => setLanguage(option.code)}
                aria-label={option.label}
                title={option.label}
              >
                <img className="language-flag" src={option.flagSrc} alt="" aria-hidden="true" />
                <span className="sr-only">{option.label}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="menu-sections">
          <div className="category-nav" aria-label="Categorías de la carta">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                className={category === activeCategory ? "active" : ""}
                onClick={() => handleCategoryClick(category)}
                ref={(node) => {
                  if (node) {
                    categoryButtonRefs.current[category] = node;
                  }
                }}
              >
                <span>{category}</span>
                <strong>{groupedProducts[category].length}</strong>
              </button>
            ))}
          </div>

          <article className="category-block" ref={articleRef}>
            {categories.length === 0 ? (
              <p className="empty-state">{text.empty}</p>
            ) : (
              <>
                {categories.map((category) => {
                  const products = groupedProducts[category] || [];

                  return (
                    <React.Fragment key={category}>
                      <section
                        className="category-section"
                        ref={(node) => {
                          if (node) {
                            sectionRefs.current[category] = node;
                          }
                        }}
                      >
                        <div className="category-header">
                          <h2>{category}</h2>
                          <span>{products.length}</span>
                        </div>

                        <div className="product-grid">
                          {products.map((product, index) => {
                            const localizedName = toSentenceCase(
                              getLocalizedText(product.NAME, language)
                            );
                            const productAllergens = (product.ALERG || [])
                              .map((id) => allergensById[id])
                              .filter(Boolean);
                            const isIncrementCard = product.STYLE === "incremento";
                            const shouldShowPrice = hasDisplayPrice(product.PRICE);

                            return (
                              <article
                                className={`product-card ${isIncrementCard ? "product-card-highlight" : ""}`}
                                key={`${category}-${index}-${localizedName}`}
                              >
                                {!isIncrementCard ? (
                                  <ProductImage
                                    pic={product.PIC}
                                    alt={localizedName}
                                    openLabel={text.viewImage}
                                    onOpen={setSelectedImage}
                                  />
                                ) : null}

                                <div className="product-topline">
                                  <h3>{localizedName}</h3>
                                  {shouldShowPrice ? (
                                    <strong>
                                      {formatPrice(product.PRICE, language)}
                                      {text.priceSuffix}
                                    </strong>
                                  ) : null}
                                </div>

                                {productAllergens.length > 0 && !isIncrementCard ? (
                                  <details className="product-details">
                                    <summary>
                                      <span className="product-details-label">
                                        <span className="product-details-icon" aria-hidden="true">
                                          +
                                        </span>
                                        <span>{text.detailsSummary}</span>
                                      </span>
                                      <small>({productAllergens.length})</small>
                                    </summary>

                                    <div className="allergen-panel">
                                      <span>{text.allergens}</span>
                                      <div className="allergen-list">
                                        {productAllergens.map((allergen) => (
                                          <div
                                            className="allergen-chip"
                                            key={allergen.ID}
                                            title={getLocalizedText(allergen.NAME, language)}
                                          >
                                            {allergen.icon ? (
                                              <img
                                                src={allergen.icon}
                                                alt={getLocalizedText(allergen.NAME, language)}
                                              />
                                            ) : null}
                                            <small>{getLocalizedText(allergen.NAME, language)}</small>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </details>
                                ) : null}
                              </article>
                            );
                          })}
                        </div>
                      </section>

                      {category !== categories[categories.length - 1] ? (
                        <hr className="category-divider" aria-hidden="true" />
                      ) : null}
                    </React.Fragment>
                  );
                })}

                <footer className="menu-credit">{text.designBy}</footer>
              </>
            )}
          </article>
        </section>
      </main>

      {selectedImage ? (
        <div
          className="image-modal"
          role="dialog"
          aria-modal="true"
          aria-label={selectedImage.alt}
          onClick={() => setSelectedImage(null)}
        >
          <div className="image-modal-content" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              className="image-modal-close"
              onClick={() => setSelectedImage(null)}
              aria-label={text.closeModal}
            >
              x
            </button>
            <img
              className="image-modal-photo"
              src={selectedImage.src}
              alt={selectedImage.alt}
              onClick={() => setSelectedImage(null)}
            />
          </div>
        </div>
      ) : null}

      {isAllergensModalOpen ? (
        <div
          className="image-modal"
          role="dialog"
          aria-modal="true"
          aria-label={text.openAllergens}
          onClick={() => setIsAllergensModalOpen(false)}
        >
          <div className="image-modal-content allergens-modal-content" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              className="image-modal-close"
              onClick={() => setIsAllergensModalOpen(false)}
              aria-label={text.closeAllergens}
            >
              x
            </button>

            <div className="allergens-modal-header">
              <h2>{text.openAllergens}</h2>
            </div>

            <div className="allergens-modal-grid">
              {allergensData.map((allergen) => {
                const localizedName = getLocalizedText(allergen.NAME, language);
                const localizedDescription = getLocalizedText(allergen.DESC, language);
                const allergenAsset = allergensById[allergen.ID];

                return (
                  <article className="allergens-modal-card" key={allergen.ID}>
                    <div className="allergens-modal-topline">
                      {allergenAsset?.icon ? <img src={allergenAsset.icon} alt={localizedName} /> : null}
                      <strong>{localizedName}</strong>
                    </div>
                    {localizedDescription ? <p>{localizedDescription}</p> : null}
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}

      {showBackToTop ? (
        <button
          type="button"
          className="back-to-top-button"
          onClick={handleBackToTop}
          aria-label={text.backToTop}
          title={text.backToTop}
        >
          <span aria-hidden="true">↑</span>
        </button>
      ) : null}
    </div>
  );
}

export default App;
