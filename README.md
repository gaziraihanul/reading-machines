# reading-machines

#
Reading Machines is an interactive web application in which users compose texts collaboratively with a statistical language model while a live sentiment system tracks and visualizes the emotional register of the accumulating writing. Users enter any seed phrase of up to thirty characters; no prescribed options are given, and the model offers four predicted next words as clickable options at each step. As words accumulate, the page background shifts from cool gray to warm gold with positive sentiment and deepens into blue with negative. The typography of each word adjusts accordingly: words scoring +4 or above on the AFINN sentiment lexicon render larger and in gold; words scoring −4 or below render smaller, italic, and in deep indigo; neutral words remain unstyled. The system does not steer the user toward any particular emotional register; sentiment accumulates entirely through the user’s choices. Crucially, the system does not truly “identify” emotion: it looks up each word in AFINN, a dataset of approximately 2,500 English words rated −5 to +5 by human annotators. That reductiveness is intentional and is itself the argument.
#
The prediction model was trained on five canonical public domain texts: Whitman’s Leaves of Grass, Dickinson’s complete poems, Poe’s tales, Woolf’s The Waves, and Stein’s Tender Buttons, alongside excerpts from course texts by Racter, Mouré, Whitehead, Kaur, and Rhee. This choice is not neutral: public domain digitization reflects who was institutionally recognized and archived. Whitehead’s Indigiqueer language has almost no public domain analogues, because Indigenous literary traditions were systematically excluded from that archive. Predictions anchored in Whitehead’s language are therefore statistically sparse and drift toward the model’s dominant vocabulary. This disparity is foregrounded rather than hidden: prediction confidence is visible in each button’s border; solid for a strong trigram match, dashed for partial, dotted for a fallback guess. The model’s uncertainty is made legible, which is precisely the argument N. Katherine Hayles makes in “Print Is Flat, Code Is Deep”: the computational layer of a text encodes meaning that reading alone cannot reveal.
#
The project engages with co-authorship as critical rather than celebratory. Unlike autocomplete tools that make the machine invisible, Reading Machines foregrounds its role at every step. The clickable prediction web encodes relational meaning through link structure in ways that recall Angela Haas’s reading of wampum belts as hypertext: each click is a choice, but the available choices are determined entirely by statistical patterns in the training data. Every eight words, an “echo”; a word already in the text, appears as an option. Every five words, a transitional connective (“because”, “despite”, “as if”) is offered, giving users the grammar of meaning-making without dictating its content. Glitch tokens destabilize the system visually, causing text to flicker and the background to cycle, enacting Legacy Russell’s understanding of the glitch as a site of refusal and disruption.
#
The project’s primary strength is that it makes critique experiential: a user does not read about algorithmic bias, they feel it when the model confidently continues Whitman but fumbles Whitehead. Its primary limitation is that a trigram model cannot produce coherent prose. This is framed as finding rather than failure; the gap between statistical pattern and meaning is precisely what the tool asks users to inhabit. To expand it, I would build author-specific sub-models and add a side-by-side view showing the same seed continued by two different corpora, making the decolonial argument explicit and comparative.
The project engages with Ruha Benjamin’s critique of algorithmic systems reproducing cultural hierarchies under a mask of objectivity; Mohamed et al.’s framework for decolonial AI; Hayles’s call for media-specific analysis; Haas’s reading of wampum as hypertext; and Russell’s theorization of the glitch as political and aesthetic refusal. Together, these scholars provide the critical vocabulary for what the tool makes visible: not just what the model predicts, but what it cannot predict, and why.












#
Works Cited

- Benjamin, Ruha. “The New Artificial Intelligentsia.” Los Angeles Review of Books, 2024, lareviewofbooks.org/article/the-new-artificial-intelligentsia/.

- Haas, Angela M. “Wampum as Hypertext: An American Indian Intellectual Tradition of Multimedia Theory and Practice.” Studies in American Indian Literatures, vol. 19, no. 4, 2007, pp. 77–100.

- Hayles, N. Katherine. “Print Is Flat, Code Is Deep: The Importance of Media-Specific Analysis.” Transmedia Frictions, edited by Marsha Kinder and Tara McPherson, U of California P, 2014, pp. 20–33.

- Mohamed, Shakir, et al. “Decolonial AI: Decolonial Theory as Sociotechnical Foresight in Artificial Intelligence.” Philosophy & Technology, vol. 33, 2020, pp. 659–684.

- Russell, Legacy. Glitch Feminism: A Manifesto. Verso, 2020.
