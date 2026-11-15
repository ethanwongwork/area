// Text rows drawn by CoreText (the macOS rasteriser), for proofs beside FreeType's.
//   swift ct_render.swift spec.json out.png      spec: {"width": w, "rows": [{"font": path, "size": px, "text": s, "label": s}]}
import Foundation
import CoreText
import CoreGraphics
import ImageIO
import UniformTypeIdentifiers

struct Row: Codable { let font: String; let size: Double; let text: String; let label: String }
struct Spec: Codable { let width: Int; let rows: [Row] }

let args = CommandLine.arguments
let spec = try JSONDecoder().decode(Spec.self, from: Data(contentsOf: URL(fileURLWithPath: args[1])))
let heights = spec.rows.map { Int(($0.size * 1.5).rounded()) + 8 }
let H = heights.reduce(0, +)
let W = spec.width
func draw(dark: Bool) -> CGImage {
    let ctx = CGContext(data: nil, width: W, height: H, bitsPerComponent: 8, bytesPerRow: 0,
                        space: CGColorSpaceCreateDeviceGray(), bitmapInfo: CGImageAlphaInfo.none.rawValue)!
    ctx.setFillColor(gray: dark ? 0 : 1, alpha: 1)
    ctx.fill(CGRect(x: 0, y: 0, width: W, height: H))
    ctx.setShouldAntialias(true)
    ctx.setShouldSmoothFonts(false)
    var y = H
    let labelFont = CTFontCreateWithName("Helvetica" as CFString, 10, nil)
    for (row, h) in zip(spec.rows, heights) {
        y -= h
        let fg = CGColor(gray: dark ? 1 : 0, alpha: 1)
        func line(_ s: String, _ f: CTFont, _ c: CGColor, _ x: Double, _ yy: Double) {
            let a = NSAttributedString(string: s, attributes: [NSAttributedString.Key(kCTFontAttributeName as String): f,
                                                                NSAttributedString.Key(kCTForegroundColorAttributeName as String): c])
            ctx.textPosition = CGPoint(x: x, y: yy)
            CTLineDraw(CTLineCreateWithAttributedString(a), ctx)
        }
        line(row.label, labelFont, CGColor(gray: 0.5, alpha: 1), 6, Double(y) + Double(h) / 2 - 3)
        let desc = CTFontManagerCreateFontDescriptorsFromURL(URL(fileURLWithPath: row.font) as CFURL) as! [CTFontDescriptor]
        let font = CTFontCreateWithFontDescriptor(desc[0], CGFloat(row.size), nil)
        line(row.text, font, fg, 190, Double(y) + row.size * 0.42 + 4)
    }
    return ctx.makeImage()!
}
for (dark, suffix) in [(false, ""), (true, "-dark")] {
    let out = args[2].replacingOccurrences(of: ".png", with: suffix + ".png")
    let dest = CGImageDestinationCreateWithURL(URL(fileURLWithPath: out) as CFURL, UTType.png.identifier as CFString, 1, nil)!
    CGImageDestinationAddImage(dest, draw(dark: dark), nil)
    CGImageDestinationFinalize(dest)
    print(out)
}
