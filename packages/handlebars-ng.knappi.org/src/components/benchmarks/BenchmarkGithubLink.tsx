import { githubUrl } from "@/constants"
import type { Component } from "solid-js"

export const BenchmarkGithubLink: Component<{filename: string }> = ({ filename }) => {
    const githubLink = `${githubUrl}/blob/main/packages/%40handlebars-ng/benchmarks/src/tests/${filename}`
    return <a href={githubLink}>{filename}</a>
}