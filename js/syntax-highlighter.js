/**
 * syntax-highlighter.js
 * Resaltador sintáctico ultra-robusto para Python (SciPy/NumPy/Matplotlib) y MATLAB.
 * Compatible con cualquier navegador sin dependencias externas.
 */

const SyntaxHighlighter = {
  escape(text) {
    if (!text) return "";
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  },

  highlightPython(code) {
    if (!code) return "";
    const lines = code.split("\n");

    const processed = lines.map(line => {
      // Separar comentario #
      let codePart = line;
      let commentPart = "";

      const hashIdx = line.indexOf("#");
      if (hashIdx !== -1) {
        codePart = line.substring(0, hashIdx);
        commentPart = line.substring(hashIdx);
      }

      let res = this.escape(codePart);

      // Strings entre comillas dobles y simples
      res = res.replace(/"([^"\\]|\\.)*"/g, '<span class="hl-str">$&</span>');
      res = res.replace(/'([^'\\]|\\.)*'/g, '<span class="hl-str">$&</span>');

      // Keywords de Python
      const kwRegex = /\b(import|from|as|def|return|if|else|elif|for|in|while|with|class|try|except)\b/g;
      res = res.replace(kwRegex, '<span class="hl-kw">$1</span>');

      // Librerías científicas
      const libRegex = /\b(np|numpy|scipy|signal|plt|matplotlib|pyplot)\b/g;
      res = res.replace(libRegex, '<span class="hl-lib">$1</span>');

      // Funciones de SciPy y Pyplot
      const fnRegex = /\b(TransferFunction|step|impulse|bode|lsim|plot|title|xlabel|ylabel|grid|show|scatter|semilogx|figure|subplot|subplots|tight_layout|array|zeros|zeros_like|linspace|convolve|real|imag|axhline|axvline|set_title|set_xlabel|set_ylabel)\b/g;
      res = res.replace(fnRegex, '<span class="hl-fn">$1</span>');

      // Números (evitando reemplazar dentro de tags html)
      res = res.replace(/\b(\d+\.?\d*|\.\d+)\b/g, '<span class="hl-num">$1</span>');

      // Reensamblar comentario
      if (commentPart) {
        res += `<span class="hl-comment">${this.escape(commentPart)}</span>`;
      }

      return res;
    });

    return processed.join("\n");
  },

  highlightMatlab(code) {
    if (!code) return "";
    const lines = code.split("\n");

    const processed = lines.map(line => {
      // Separar comentario %
      let codePart = line;
      let commentPart = "";

      const pctIdx = line.indexOf("%");
      if (pctIdx !== -1) {
        codePart = line.substring(0, pctIdx);
        commentPart = line.substring(pctIdx);
      }

      let res = this.escape(codePart);

      // Strings de MATLAB
      res = res.replace(/'([^'\\]|\\.)*'/g, '<span class="hl-str">$&</span>');

      // Keywords de MATLAB
      const kwRegex = /\b(clear|clc|close|all|hold|on|off|if|else|elseif|end|for|while|function|return|disp)\b/g;
      res = res.replace(kwRegex, '<span class="hl-kw">$1</span>');

      // Funciones de Control y Gráficas de MATLAB
      const fnRegex = /\b(tf|step|impulse|bode|lsim|pole|zero|scatter|plot|semilogx|title|xlabel|ylabel|grid|legend|xline|yline|figure|subplot|linspace|zeros|size|log10|squeeze|isempty|sprintf|real|imag)\b/g;
      res = res.replace(fnRegex, '<span class="hl-fn">$1</span>');

      // Números
      res = res.replace(/\b(\d+\.?\d*|\.\d+)\b/g, '<span class="hl-num">$1</span>');

      // Reensamblar comentario
      if (commentPart) {
        res += `<span class="hl-comment">${this.escape(commentPart)}</span>`;
      }

      return res;
    });

    return processed.join("\n");
  }
};

if (typeof window !== "undefined") {
  window.SyntaxHighlighter = SyntaxHighlighter;
}
