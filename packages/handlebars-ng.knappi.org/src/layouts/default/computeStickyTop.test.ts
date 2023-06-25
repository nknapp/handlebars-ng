import { describe } from "vitest";
import { computeStickyTop } from "@/layouts/default/computeStickyTop";

describe("computeStickyTop", () => {
  describe("when scrolling down", () => {
    it("returns the 0 if top of the parent and sticky are inside viewport", () => {
      const scenario = new Szenario()
        .viewPortAt(0, 200)
        .containerAt(50, 100)
        .stickyAt(50, 50);
      scenario.scrollTo(10);
      expect(scenario.stickyStyleTop).toEqual(0);
    });

    it("returns viewport=top relative to parent, if parent is further up ", () => {
      const scenario = new Szenario()
        .viewPortAt(50, 200)
        .containerAt(50, 100)
        .stickyAt(50, 50);
      scenario.scrollTo(60);
      expect(scenario.stickyStyleTop).toEqual(10);
    });

    it("keeps bottom of sticky inside parent", () => {
      const scenario = new Szenario()
        .viewPortAt(50, 200)
        .containerAt(50, 100)
        .stickyAt(50, 50);
      scenario.scrollTo(110);
      expect(scenario.stickyStyleTop).toEqual(50);

      expect(
        computeStickyTop(
          true,
          { top: -50, height: 40 },
          { top: 0, height: 20 },
          80
        )
      ).toEqual(20);
    });

    it("retains position if bottom is below viewport", () => {
      const scenario = new Szenario()
        .viewPortAt(0, 100)
        .containerAt(0, 200)
        .stickyAt(0, 150);
      scenario.scrollTo(10);
      expect(scenario.stickyStyleTop).toEqual(0);
    });

    it("adjusts position of viewport goes below bottom", () => {
      const scenario = new Szenario()
        .viewPortAt(0, 100)
        .containerAt(0, 200)
        .stickyAt(0, 150);
      scenario.scrollTo(60);
      expect(scenario.stickyStyleTop).toEqual(10);
    });
  });
  describe("when scrolling up", () => {
    it("returns the 0 if top of the parent and sticky are inside viewport", () => {
      const scenario = new Szenario()
        .viewPortAt(50, 200)
        .containerAt(50, 100)
        .stickyAt(50, 50);
      scenario.scrollTo(40);
      expect(scenario.stickyStyleTop).toEqual(0);
    });

    it("returns viewport=top relative to parent, if parent is further up ", () => {
      const scenario = new Szenario()
        .viewPortAt(50, 200)
        .containerAt(30, 100)
        .stickyAt(50, 50);
      scenario.scrollTo(40);
      expect(scenario.stickyStyleTop).toEqual(10);
    });

    it("retains position if top is above viewport", () => {
      const scenario = new Szenario()
        .viewPortAt(50, 100)
        .containerAt(30, 200)
        .stickyAt(40, 150);
      scenario.scrollTo(45);
      expect(scenario.stickyStyleTop).toEqual(10);
    });

    it("retains position if new sticky-top is at viewport", () => {
      const scenario = new Szenario()
        .viewPortAt(50, 100)
        .containerAt(30, 200)
        .stickyAt(40, 150);
      scenario.scrollTo(40);
      expect(scenario.stickyStyleTop).toEqual(10);
    });

    it("moves sticky to match top with viewport top", () => {
      const scenario = new Szenario()
        .viewPortAt(50, 100)
        .containerAt(30, 200)
        .stickyAt(45, 110);
      scenario.scrollTo(40);
      expect(scenario.stickyStyleTop).toEqual(10);
    });
  });
});

class Szenario {
  viewPort = { top: 0, height: 100 };
  containerOnPage = { top: 0, height: 100 };
  stickyOnPage = { top: 0, height: 100 };
  stickyStyleTop = 0;

  viewPortAt(top: number, height: number): this {
    this.viewPort = { top, height };
    return this;
  }
  containerAt(top: number, height: number): this {
    this.containerOnPage = { top, height };
    return this;
  }

  stickyAt(top: number, height: number): this {
    this.stickyOnPage = { top, height };
    return this;
  }

  scrollTo(newViewportTop: number) {
    const scrollingDown = newViewportTop > this.viewPort.top;
    this.viewPort.top = newViewportTop;
    const container = {
      top: this.containerOnPage.top - newViewportTop,
      height: this.containerOnPage.height,
    };
    const sticky = {
      top: this.stickyOnPage.top - newViewportTop,
      height: this.stickyOnPage.height,
    };
    this.stickyStyleTop = computeStickyTop(
      scrollingDown,
      container,
      sticky,
      this.viewPort.height
    );
    this.stickyOnPage.top = this.containerOnPage.top + this.stickyStyleTop;
  }
}
